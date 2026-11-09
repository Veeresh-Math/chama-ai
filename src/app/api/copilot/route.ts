import { NextRequest, NextResponse } from 'next/server';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { and, desc, eq, gte } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { communities, transactions } from '@/db/schema';
import { auth } from '@/lib/auth/server';

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  consent: z.literal(true),
}).strict();

function sumByCurrency(
  entries: Array<{ amount: string; currency: string }>,
): Record<string, number> {
  return entries.reduce<Record<string, number>>((totals, entry) => {
    totals[entry.currency] = (totals[entry.currency] ?? 0) + Number(entry.amount);
    return totals;
  }, {});
}

export async function POST(request: NextRequest) {
  const { data: session, error: sessionError } = await auth.getSession();
  if (sessionError || !session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to use the financial copilot.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a question and consent to sending summarized financial data to the AI provider.' },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'The AI copilot is not configured on this server.' }, { status: 503 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 90);

  let context: {
    communities: {
      count: number;
      pooledFundsByCurrency: Record<string, number>;
      monthlyCommitmentsByCurrency: Record<string, number>;
      averageTrustScore: number | null;
    };
    recentPayPalLedger: {
      linkedRecordCount: number;
      completedRecordCount: number;
      completedAmountByCurrency: Record<string, number>;
    };
  };

  try {
    const [ownedCommunities, recentTransactions] = await Promise.all([
      db.select({
        totalFunds: communities.totalFunds,
        monthlyContribution: communities.monthlyContribution,
        currency: communities.currency,
        trustScore: communities.trustScore,
      })
        .from(communities)
        .where(eq(communities.ownerId, session.user.id))
        .limit(100),
      db.select({
        amount: transactions.amount,
        currency: transactions.currency,
        status: transactions.status,
        paypalTransactionId: transactions.paypalTransactionId,
      })
        .from(transactions)
        .where(and(
          eq(transactions.userId, session.user.id),
          gte(transactions.createdAt, since),
        ))
        .orderBy(desc(transactions.createdAt))
        .limit(200),
    ]);

    const paypalTransactions = recentTransactions.filter((transaction) => transaction.paypalTransactionId);
    const completedPayPalTransactions = paypalTransactions.filter((transaction) => transaction.status === 'completed');
    const trustScores = ownedCommunities
      .map((community) => community.trustScore)
      .filter((score): score is number => score !== null);

    context = {
      communities: {
        count: ownedCommunities.length,
        pooledFundsByCurrency: sumByCurrency(ownedCommunities.map((community) => ({
          amount: community.totalFunds ?? '0',
          currency: community.currency,
        }))),
        monthlyCommitmentsByCurrency: sumByCurrency(ownedCommunities.map((community) => ({
          amount: community.monthlyContribution,
          currency: community.currency,
        }))),
        averageTrustScore: trustScores.length
          ? trustScores.reduce((total, score) => total + score, 0) / trustScores.length
          : null,
      },
      recentPayPalLedger: {
        linkedRecordCount: paypalTransactions.length,
        completedRecordCount: completedPayPalTransactions.length,
        completedAmountByCurrency: sumByCurrency(completedPayPalTransactions),
      },
    };
  } catch (error) {
    console.error('Financial copilot context query failed:', error);
    return NextResponse.json({ error: 'Could not load your financial summary.' }, { status: 500 });
  }

  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are Cham.ai's read-only financial education copilot. Answer the user's question using only the supplied aggregate summary. Do not invent balances, transaction details, rates, or guarantees. State when the summary does not contain enough information. Never claim to initiate, approve, or complete a payment; this chat cannot move money. Offer practical, cautious explanations, not personalized investment, legal, or tax advice.

The user has consented to share this aggregate summary with the AI provider. It contains no names, emails, transaction descriptions, or payment identifiers:
{context}`,
      ],
      ['human', '{question}'],
    ]);
    const model = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0.2 });
    const result = await prompt.pipe(model).invoke({
      context: JSON.stringify(context),
      question: parsed.data.message,
    });

    const answer = typeof result.content === 'string'
      ? result.content
      : result.content.map((part) => (
        typeof part === 'string'
          ? part
          : typeof part === 'object' && part !== null && 'text' in part && typeof part.text === 'string'
            ? part.text
            : ''
      )).join('');

    if (!answer.trim()) {
      console.error('Financial copilot returned an empty answer.');
      return NextResponse.json({ error: 'The AI copilot returned an empty response. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Financial copilot model request failed:', error);
    return NextResponse.json({ error: 'The AI copilot could not answer right now. Please try again.' }, { status: 502 });
  }
}
