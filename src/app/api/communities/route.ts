import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { communities, communityMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getUserId(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userCommunities = await db.query.communities.findMany({
      where: eq(communities.ownerId, userId),
      with: {
        members: true,
        contributions: { limit: 5, orderBy: (c, { desc }) => [desc(c.contributedAt)] },
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json({ communities: userCommunities });
  } catch (error) {
    console.error('Get communities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, description, monthlyContribution, currency, autoDistribute, memberEmails } = await request.json();

    if (!name || !monthlyContribution || !memberEmails?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const community = await db.insert(communities).values({
      name,
      description,
      ownerId: userId,
      monthlyContribution: monthlyContribution.toString(),
      currency: currency || 'USD',
      autoDistribute: autoDistribute || false,
      trustScore: 0,
      totalFunds: '0',
    }).returning();

    const communityId = community[0].id;

    // Add members
    const members = memberEmails.map((email: string) => ({
      communityId,
      email: email.trim(),
      sharePercentage: (100 / memberEmails.length).toFixed(2),
    }));

    await db.insert(communityMembers).values(members);

    // Trigger trust scoring via queue
    // await enqueueJob(QUEUE_KEYS.TRUST_SCORING, { communityId });

    return NextResponse.json({ community: community[0] }, { status: 201 });
  } catch (error) {
    console.error('Create community error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}