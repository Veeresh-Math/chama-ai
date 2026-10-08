import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createToolCallingAgent } from 'langchain/agents';
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { db } from '@/db';
import { communities, communityMembers, contributions, distributions, gigJobs, gigMilestones, transactions, users } from '@/db/schema';
import { eq, and, sum, sql } from 'drizzle-orm';
import { createPayPalPayment, createSplitPayment } from '@/lib/paypal';

// Tool: Create PayPal Payment
const createPaymentTool = new StructuredTool({
  name: 'create_paypal_payment',
  description: 'Create a PayPal payment to send money to a recipient. Use this when you need to process a payment.',
  schema: z.object({
    amount: z.number().positive(),
    currency: z.string().default('USD'),
    recipient: z.string().email(),
    description: z.string(),
  }),
  func: async ({ amount, currency, recipient, description }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const payment = await createPayPalPayment({
      amount,
      currency,
      description,
      returnUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancel`,
    });
    return `Payment created successfully! ID: ${payment.id}. Approval URL: ${payment.links?.find(l => l.rel === 'approval_url')?.href}`;
  },
});

// Tool: Create Split Payment (Community Distribution)
const createSplitPaymentTool = new StructuredTool({
  name: 'create_split_payment',
  description: 'Create a split PayPal payment to multiple recipients. Use this for community savings groups.',
  schema: z.object({
    amount: z.number().positive(),
    currency: z.string().default('USD'),
    recipients: z.array(z.object({
      email: z.string().email(),
      share: z.number().positive(),
      name: z.string().optional(),
    })),
    description: z.string(),
  }),
  func: async ({ amount, currency, recipients, description }) => {
    const senderBatchId = `community_${Date.now()}`;
    const payout = await createSplitPayment({
      senderBatchId,
      emailSubject: description,
      items: recipients.map(r => ({
        recipient_type: 'EMAIL',
        amount: { value: r.share.toFixed(2), currency },
        receiver: r.email,
        note: r.name,
      })),
    });
    return `Split payment created successfully! Batch ID: ${payout.batch_header.payout_batch_id}`;
  },
});

// Tool: Get Community Data
const getCommunityDataTool = new StructuredTool({
  name: 'get_community_data',
  description: 'Get community savings data including members, contributions, and trust scores.',
  schema: z.object({
    communityId: z.string().uuid(),
  }),
  func: async ({ communityId }) => {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
      with: {
        members: true,
        contributions: true,
        distributions: true,
      },
    });
    return JSON.stringify(community, null, 2);
  },
});

// Tool: Get User's Gig Jobs
const getGigJobsTool = new StructuredTool({
  name: 'get_gig_jobs',
  description: 'Get user\'s gig jobs and milestones.',
  schema: z.object({
    userId: z.string().uuid(),
  }),
  func: async ({ userId }) => {
    const jobs = await db.query.gigJobs.findMany({
      where: eq(gigJobs.freelancerId, userId),
      with: { milestones: true },
    });
    return JSON.stringify(jobs, null, 2);
  },
});

// Tool: Get User Transactions
const getUserTransactionsTool = new StructuredTool({
  name: 'get_user_transactions',
  description: 'Get user\'s recent transactions for financial analysis.',
  schema: z.object({
    userId: z.string().uuid(),
    limit: z.number().default(50),
  }),
  func: async ({ userId, limit }) => {
    const txns = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: (txns, { desc }) => [desc(txns.createdAt)],
      limit,
    });
    return JSON.stringify(txns, null, 2);
  },
});

// Tool: Analyze Community Trust
const analyzeTrustTool = new StructuredTool({
  name: 'analyze_community_trust',
  description: 'Analyze community for fraud risk and assign trust score 0-100.',
  schema: z.object({
    communityId: z.string().uuid(),
  }),
  func: async ({ communityId }) => {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
      with: { members: true, contributions: true },
    });

    if (!community) return 'Community not found';

    // Simple trust scoring logic
    const memberCount = community.members.length;
    const totalContributions = community.contributions
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const avgContribution = memberCount > 0 ? totalContributions / memberCount : 0;
    const contributionConsistency = community.contributions.length > 0
      ? community.contributions.filter(c => c.status === 'completed').length / community.contributions.length
      : 0;

    let trustScore = 50;
    trustScore += Math.min(memberCount * 2, 20); // More members = more trust
    trustScore += Math.min(avgContribution / 100 * 10, 15); // Higher contributions
    trustScore += contributionConsistency * 15; // Consistency
    trustScore = Math.max(0, Math.min(100, Math.round(trustScore)));

    // Update community trust score
    await db.update(communities)
      .set({ trustScore, updatedAt: new Date() })
      .where(eq(communities.id, communityId));

    return `Trust analysis complete. Community: ${community.name}. Trust Score: ${trustScore}/100. Factors: ${memberCount} members, $${avgContribution.toFixed(2)} avg contribution, ${(contributionConsistency * 100).toFixed(0)}% consistency.`;
  },
});

// Tool: Check Milestones
const checkMilestonesTool = new StructuredTool({
  name: 'check_gig_milestones',
  description: 'Check if all milestones for a gig job are completed and trigger payment if so.',
  schema: z.object({
    jobId: z.string().uuid(),
  }),
  func: async ({ jobId }) => {
    const job = await db.query.gigJobs.findFirst({
      where: eq(gigJobs.id, jobId),
      with: { milestones: true },
    });

    if (!job) return 'Job not found';

    const allCompleted = job.milestones.every(m => m.isCompleted);
    if (allCompleted && job.status !== 'completed') {
      // Trigger payment via agent
      return `All milestones completed for "${job.title}"! Ready to process payment of $${job.total_budget} to ${job.clientEmail}.`;
    }

    const pending = job.milestones.filter(m => !m.isCompleted).map(m => m.name).join(', ');
    return `Job "${job.title}" has pending milestones: ${pending}. ${job.milestones.filter(m => m.isCompleted).length}/${job.milestones.length} completed.`;
  },
});

// Create Agent
export function createFinancialAgent(userId: string) {
  const llm = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.1,
  });

  const tools = [
    createPaymentTool,
    createSplitPaymentTool,
    getCommunityDataTool,
    getGigJobsTool,
    getUserTransactionsTool,
    analyzeTrustTool,
    checkMilestonesTool,
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a financial agent for Chama.ai - an AI-powered community savings and gig worker platform.
      
Your capabilities:
1. Create PayPal payments for individuals and communities
2. Analyze community trust scores for fraud prevention
3. Track gig worker milestones and trigger autonomous payments
4. Provide financial insights from transaction history

Guidelines:
- Always verify transaction details before executing
- Prioritize security and user confirmation for payments
- Explain actions clearly before taking them
- Use the user's context (communities, gigs, transactions) to provide personalized advice
- For community distributions, ensure fair splits based on contributions
- For gig payments, verify all milestones are completed

Current user ID: ${userId}`,
    ],
    ['user', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = createToolCallingAgent({ llm, tools, prompt });
  return new AgentExecutor({ agent, tools, verbose: true });
}