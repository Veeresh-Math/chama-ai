import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import {
  communities,
  contributions,
  distributions,
  type Contribution,
  type Distribution,
} from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getUserId(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id || null;
}

function isCompleted<T extends { status: string | null }>(row: T): boolean {
  return row.status === 'completed';
}

function safeNum(v: string | null | undefined): number {
  return v ? Number(v) : 0;
}

function safeDate(v: Date | null): string | null {
  return v ? v.toISOString() : null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    const now = new Date();
    const rangeStart = new Date(now);
    if (range === '7d') rangeStart.setDate(now.getDate() - 7);
    else if (range === '90d') rangeStart.setDate(now.getDate() - 90);
    else rangeStart.setDate(now.getDate() - 30);

    const userCommunities = await db.query.communities.findMany({
      where: eq(communities.ownerId, userId),
      with: {
        members: true,
        contributions: true,
        distributions: true,
      },
    });

    const totalCommunities = userCommunities.length;
    const totalMembers = userCommunities.reduce((sum, c) => sum + c.members.length, 0);
    const totalFunds = userCommunities.reduce((sum, c) => sum + safeNum(c.totalFunds), 0);
    const avgTrustScore =
      totalCommunities > 0
        ? Math.round(
            userCommunities.reduce((sum, c) => sum + (c.trustScore ?? 0), 0) / totalCommunities
          )
        : 0;

    const completedContributions: Contribution[] = userCommunities.flatMap((c) =>
      c.contributions.filter(
        (cont) =>
          isCompleted(cont) &&
          cont.contributedAt &&
          new Date(cont.contributedAt) >= rangeStart
      )
    );
    const totalContributed = completedContributions.reduce((sum, c) => sum + safeNum(c.amount), 0);
    const contributionCount = completedContributions.length;

    const completedDistributions: Distribution[] = userCommunities.flatMap((c) =>
      c.distributions.filter(
        (d) =>
          isCompleted(d) &&
          d.createdAt &&
          new Date(d.createdAt) >= rangeStart
      )
    );
    const totalDistributed = completedDistributions.reduce(
      (sum, d) => sum + safeNum(d.totalAmount),
      0
    );
    const distributionCount = completedDistributions.length;

    const communityBreakdown = userCommunities.map((c) => {
      const completed = c.contributions.filter((cont) => isCompleted(cont));
      const contributed = completed.reduce((sum, cont) => sum + safeNum(cont.amount), 0);
      const distCompleted = c.distributions.filter((d) => isCompleted(d));
      const distributed = distCompleted.reduce((sum, d) => sum + safeNum(d.totalAmount), 0);
      return {
        id: c.id,
        name: c.name,
        trustScore: c.trustScore ?? 0,
        totalFunds: safeNum(c.totalFunds),
        memberCount: c.members.length,
        contributed,
        distributed,
        pending: safeNum(c.totalFunds) - distributed,
      };
    });

    const dailyContributions: Record<string, { amount: number; count: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dailyContributions[d.toISOString().split('T')[0]!] = { amount: 0, count: 0 };
    }

    userCommunities.forEach((c) => {
      c.contributions
        .filter((cont) => isCompleted(cont) && cont.contributedAt)
        .forEach((cont) => {
          const key = cont.contributedAt!.toISOString().split('T')[0]!;
          if (dailyContributions[key]) {
            dailyContributions[key].amount += safeNum(cont.amount);
            dailyContributions[key].count += 1;
          }
        });
    });

    const trend = Object.entries(dailyContributions).map(([date, val]) => ({
      date,
      amount: val.amount,
      count: val.count,
    }));

    return NextResponse.json({
      range,
      summary: {
        totalCommunities,
        totalMembers,
        totalFunds,
        avgTrustScore,
        totalContributed,
        contributionCount,
        totalDistributed,
        distributionCount,
        netFlow: totalContributed - totalDistributed,
      },
      communityBreakdown,
      trend,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
