import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { gigJobs, gigMilestones, transactions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSplitPayment } from '@/lib/paypal';

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
      return NextResponse.json({ error: 'Invalid gig job ID' }, { status: 400 });
    }

    const { milestone_index, milestone_name, agent_id } = await request.json();

    const job = await db.query.gigJobs.findFirst({
      where: eq(gigJobs.id, id),
      with: { milestones: { orderBy: (m, { asc: ascFn }) => [ascFn(m.createdAt)] } },
    });

    if (!job) {
      return NextResponse.json({ error: 'Gig job not found' }, { status: 404 });
    }

    if (job.status === 'completed' || job.status === 'paid') {
      return NextResponse.json({ error: 'Gig job is already completed' }, { status: 400 });
    }

    const milestones = job.milestones;
    let milestone;
    if (milestone_index !== undefined) {
      if (milestone_index < 1 || milestone_index > milestones.length) {
        return NextResponse.json({ error: `Milestone index out of range` }, { status: 400 });
      }
      milestone = milestones[milestone_index - 1];
    } else if (milestone_name) {
      milestone = milestones.find(m => m.name === milestone_name);
      if (!milestone) {
        return NextResponse.json({ error: `Milestone not found` }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'milestone_index or milestone_name is required' }, { status: 400 });
    }

    if (milestone.isCompleted) {
      return NextResponse.json({ error: 'Milestone already completed' }, { status: 400 });
    }

    const freelancerUser = await db.query.users.findFirst({
      where: eq(users.id, job.freelancerId),
    });

    if (!freelancerUser) {
      return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 });
    }

    const senderBatchId = `milestone_${milestone.id}`;
    const payout = await createSplitPayment({
      senderBatchId,
      emailSubject: `Milestone payment for ${job.title}`,
      items: [
        {
          recipient_type: 'EMAIL',
          amount: { value: milestone.amount, currency: job.currency },
          receiver: freelancerUser.email,
          note: `${milestone.name} — ${job.title}`,
        },
      ],
    });

    await db.update(gigMilestones)
      .set({ isCompleted: true, completedAt: new Date(), paypalPaymentId: payout.batch_header.payout_batch_id })
      .where(eq(gigMilestones.id, milestone.id));

    await db.insert(transactions).values({
      userId: job.freelancerId,
      type: 'gig_milestone',
      amount: milestone.amount,
      currency: job.currency,
      description: `Milestone payment: ${milestone.name} (${job.title})`,
      referenceId: milestone.id,
      referenceType: 'gig_milestone',
      paypalTransactionId: payout.batch_header.payout_batch_id,
      status: 'completed',
    });

    const allCompleted = milestones.every(m => m.isCompleted || m.id === milestone.id);
    if (allCompleted) {
      await db.update(gigJobs)
        .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
        .where(eq(gigJobs.id, job.id));
    }

    return NextResponse.json({
      success: true,
      milestone: { id: milestone.id, name: milestone.name, amount: milestone.amount, isCompleted: true },
      job: { id: job.id, status: allCompleted ? 'completed' : 'active' },
      payoutBatchId: payout.batch_header.payout_batch_id,
    });
  } catch (error) {
    console.error('Complete milestone error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
