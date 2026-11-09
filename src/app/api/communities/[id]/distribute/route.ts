import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { communities, communityMembers, distributions, transactions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createSplitPayment } from '@/lib/paypal';
import { enqueueJob, QUEUE_KEYS } from '@/lib/queue';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getUserId(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Invalid community ID' }, { status: 400 });
    }

    const { trigger = 'manual' } = await request.json();

    const community = await db.query.communities.findFirst({
      where: and(eq(communities.id, id), eq(communities.ownerId, userId)),
      with: { members: true },
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    const activeMembers = community.members.filter(m => m.isActive);
    if (activeMembers.length === 0) {
      return NextResponse.json({ error: 'No active members' }, { status: 400 });
    }

    const totalFunds = Number(community.totalFunds);
    if (totalFunds <= 0) {
      return NextResponse.json({ error: 'No funds to distribute' }, { status: 400 });
    }

    const sharePerMember = totalFunds / activeMembers.length;
    const recipients = activeMembers.map(m => ({
      email: m.email,
      share: sharePerMember,
      name: m.name,
    }));

    // Create distribution record
    const distribution = await db.insert(distributions).values({
      communityId: id,
      totalAmount: totalFunds.toFixed(2),
      currency: community.currency,
      status: 'processing',
      triggeredBy: trigger,
    }).returning();

    const distributionId = distribution[0].id;

    try {
      // Create PayPal payout
      const senderBatchId = `dist_${distributionId}_${Date.now()}`;
      const payout = await createSplitPayment({
        senderBatchId,
        emailSubject: `Distribution from ${community.name}`,
        items: recipients.map(r => ({
          recipient_type: 'EMAIL',
          amount: { value: r.share.toFixed(2), currency: community.currency },
          receiver: r.email,
          note: `Your share from ${community.name}`,
        })),
      });

      // Update distribution with PayPal batch ID
      await db.update(distributions)
        .set({
          paypalPayoutBatchId: payout.batch_header.payout_batch_id,
          status: 'completed',
          completedAt: new Date(),
        })
        .where(eq(distributions.id, distributionId));

      // Create transaction records
      const transactionRecords = activeMembers.map(m => ({
        userId: m.userId || userId, // fallback to owner if member not linked
        type: 'distribution',
        amount: sharePerMember.toFixed(2),
        currency: community.currency,
        description: `Distribution from ${community.name}`,
        referenceId: id,
        referenceType: 'community',
        paypalTransactionId: payout.batch_header.payout_batch_id,
        status: 'completed',
        metadata: { distributionId, memberEmail: m.email },
      }));

      await db.insert(transactions).values(transactionRecords);

      // Reset community total funds
      await db.update(communities)
        .set({ totalFunds: '0', updatedAt: new Date() })
        .where(eq(communities.id, id));

      return NextResponse.json({
        success: true,
        distribution: { ...distribution[0], paypalPayoutBatchId: payout.batch_header.payout_batch_id },
        recipients: recipients.length,
        amountPerRecipient: sharePerMember,
      });
    } catch (payoutError) {
      await db.update(distributions)
        .set({ status: 'failed' })
        .where(eq(distributions.id, distributionId));
      throw payoutError;
    }
  } catch (error) {
    console.error('Distribute error:', error);
    return NextResponse.json({ error: 'Distribution failed' }, { status: 500 });
  }
}