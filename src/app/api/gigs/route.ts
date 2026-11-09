import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { gigJobs, gigMilestones, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getUserId(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jobs = await db.query.gigJobs.findMany({
      with: {
        milestones: { orderBy: (m, { asc: ascFn }) => [ascFn(m.createdAt)] },
        freelancer: true,
      },
      orderBy: (j, { desc: descFn }) => [descFn(j.createdAt)],
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Get gigs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, freelancerEmail, clientName, totalBudget, currency, milestones } =
      await request.json();

    if (!title || !freelancerEmail || !totalBudget || !milestones?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalPercent = milestones.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0);
    if (totalPercent !== 100) {
      return NextResponse.json(
        { error: `Milestone percentages must sum to 100 (got ${totalPercent})` },
        { status: 400 }
      );
    }

    // Find or create freelancer user
    let freelancer = await db.query.users.findFirst({
      where: eq(users.email, freelancerEmail),
    });

    if (!freelancer) {
      const [newUser] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email: freelancerEmail,
          fullName: freelancerEmail.split('@')[0],
        })
        .returning();
      freelancer = newUser;
    }

    const [job] = await db
      .insert(gigJobs)
      .values({
        title,
        description,
        freelancerId: freelancer.id,
        clientEmail: freelancerEmail,
        clientName: clientName || freelancerEmail.split('@')[0],
        totalBudget: totalBudget.toString(),
        currency: currency || 'USD',
        status: 'active',
      })
      .returning();

    const insertedMilestones = [];
    for (const m of milestones) {
      const [milestone] = await db
        .insert(gigMilestones)
        .values({
          jobId: job.id,
          name: m.name,
          description: m.description,
          percentage: m.percentage,
          amount: (Number(totalBudget) * (m.percentage / 100)).toFixed(2),
        })
        .returning();
      insertedMilestones.push(milestone);
    }

    return NextResponse.json({
      job: { ...job, milestones: insertedMilestones },
    });
  } catch (error) {
    console.error('Create gig error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
