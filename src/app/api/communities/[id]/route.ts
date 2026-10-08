import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { db } from '@/db';
import { communities, communityMembers, contributions, distributions } from '@/db/schema';
import { eq, and, desc, sum } from 'drizzle-orm';
import { createFinancialAgent } from '@/lib/agent';
import { enqueueJob, QUEUE_KEYS } from '@/lib/queue';

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const community = await db.query.communities.findFirst({
      where: and(eq(communities.id, id), eq(communities.ownerId, userId)),
      with: {
        members: true,
        contributions: { orderBy: (c, { desc }) => [desc(c.createdAt)] },
        distributions: { orderBy: (d, { desc }) => [desc(d.createdAt)] },
      },
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Calculate stats
    const totalContributions = community.contributions
      .filter(c => c.status === 'completed')
      .reduce((acc, c) => acc + Number(c.amount), 0);

    const pendingContributions = community.contributions
      .filter(c => c.status === 'pending')
      .reduce((acc, c) => acc + Number(c.amount), 0);

    return NextResponse.json({
      community: {
        ...community,
        stats: {
          totalContributions,
          pendingContributions,
          memberCount: community.members.length,
          completedDistributions: community.distributions.filter(d => d.status === 'completed').length,
        },
      },
    });
  } catch (error) {
    console.error('Get community error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}