import { z } from 'zod';
import { Tool } from '@/types/mcp';
import { CallToolResult } from '@/types/mcp';
import { db } from '@/db';
import { communities, communityMembers, contributions, distributions, transactions, users } from '@/db/schema';
import { eq, and, sum, desc } from 'drizzle-orm';
import { createPayment, createSplitPayment } from '@/lib/paypal';

// ============================================
// Zod Input Schemas
// ============================================

export const createChamaInputSchema = z.object({
  name: z.string().min(1).max(255),
  owner_email: z.string().email(),
  monthly_contribution: z.number().positive(),
  currency: z.enum(['USD', 'KES', 'NGN', 'PYUSD']).default('USD'),
  member_emails: z.array(z.string().email()).min(1).max(50),
  auto_distribute: z.boolean().default(false),
});

export const joinChamaInputSchema = z.object({
  community_id: z.string().uuid(),
  user_email: z.string().email(),
  share_percentage: z.number().min(0).max(100).optional(),
});

export const contributeInputSchema = z.object({
  community_id: z.string().uuid(),
  member_email: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
});

export const distributeFundsInputSchema = z.object({
  community_id: z.string().uuid(),
  triggered_by: z.enum(['manual', 'auto', 'agent']).optional(),
});

export const getCommunityStateInputSchema = z.object({
  community_id: z.string().uuid(),
});

export const analyzeTrustInputSchema = z.object({
  community_id: z.string().uuid(),
});

// ============================================
// Handler Functions
// ============================================

async function handleCreateChama(params: z.infer<typeof createChamaInputSchema>): Promise<CallToolResult> {
  try {
    let owner = await db.query.users.findFirst({
      where: eq(users.email, params.owner_email),
    });

    if (!owner) {
      const [newOwner] = await db.insert(users).values({
        id: crypto.randomUUID(),
        email: params.owner_email,
        fullName: params.owner_email.split('@')[0],
      }).returning();
      owner = newOwner;
    }

    const [community] = await db.insert(communities).values({
      name: params.name,
      ownerId: owner.id,
      monthlyContribution: params.monthly_contribution.toFixed(2),
      currency: params.currency,
      autoDistribute: params.auto_distribute,
      trustScore: 50,
      totalFunds: '0',
    }).returning();

    for (const email of params.member_emails) {
      let memberUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!memberUser) {
        const [newUser] = await db.insert(users).values({
          id: crypto.randomUUID(),
          email,
          fullName: email.split('@')[0],
        }).returning();
        memberUser = newUser;
      }

      const sharePercentage = 100 / params.member_emails.length;
      await db.insert(communityMembers).values({
        communityId: community.id,
        userId: memberUser.id,
        email,
        name: memberUser.fullName,
        sharePercentage: sharePercentage.toFixed(2),
        trustScore: 50,
      });
    }

    if (!params.member_emails.includes(params.owner_email)) {
      await db.insert(communityMembers).values({
        communityId: community.id,
        userId: owner.id,
        email: params.owner_email,
        name: owner.fullName,
        sharePercentage: (100 / (params.member_emails.length + 1)).toFixed(2),
        trustScore: 50,
      });
    }

    return {
      content: [{
        type: 'text',
        text: `Created chama "${community.name}" (ID: ${community.id}) with ${params.member_emails.length} members. Monthly contribution: ${params.monthly_contribution} ${params.currency}. Auto-distribute: ${params.auto_distribute}`,
      }],
    };
  } catch (error) {
    console.error('[MCP] create_chama error:', error);
    return {
      content: [{ type: 'text', text: `Failed to create chama: ${error instanceof Error ? error.message : 'Unknown error'}` }],
      isError: true,
    };
  }
}

async function handleJoinChama(params: z.infer<typeof joinChamaInputSchema>): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
    });

    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    let user = await db.query.users.findFirst({ where: eq(users.email, params.user_email) });
    if (!user) {
      const [newUser] = await db.insert(users).values({
        id: crypto.randomUUID(),
        email: params.user_email,
        fullName: params.user_email.split('@')[0],
      }).returning();
      user = newUser;
    }

    const existingMember = await db.query.communityMembers.findFirst({
      where: and(eq(communityMembers.communityId, params.community_id), eq(communityMembers.userId, user.id)),
    });

    if (existingMember) {
      return { content: [{ type: 'text', text: `User already a member of community ${params.community_id}` }], isError: true };
    }

    const sharePercentage = params.share_percentage || 100 / 50;
    await db.insert(communityMembers).values({
      communityId: params.community_id,
      userId: user.id,
      email: params.user_email,
      name: user.fullName,
      sharePercentage: sharePercentage.toFixed(2),
      trustScore: 50,
    });

    return { content: [{ type: 'text', text: `User ${params.user_email} joined community ${params.community_id} with ${sharePercentage.toFixed(2)}% share` }] };
  } catch (error) {
    console.error('[MCP] join_chama error:', error);
    return { content: [{ type: 'text', text: `Failed to join chama: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

async function handleContribute(params: z.infer<typeof contributeInputSchema>): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
      with: { members: true },
    });

    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    const member = community.members.find(m => m.email === params.member_email);
    if (!member) {
      return { content: [{ type: 'text', text: `Member not found in community: ${params.member_email}` }], isError: true };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const payment = await createPayment({
      amount: params.amount,
      currency: params.currency,
      description: `Contribution to ${community.name}`,
      returnUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancel`,
    });

    await db.insert(contributions).values({
      communityId: params.community_id,
      memberId: member.id,
      amount: params.amount.toFixed(2),
      currency: params.currency,
      paypalPaymentId: payment.id,
      status: 'pending',
    });

    await db.update(communityMembers)
      .set({ totalContributed: (Number(member.totalContributed) + params.amount).toFixed(2) })
      .where(eq(communityMembers.id, member.id));

    await db.update(communities)
      .set({ totalFunds: (Number(community.totalFunds) + params.amount).toFixed(2) })
      .where(eq(communities.id, params.community_id));

    return {
      content: [{
        type: 'text',
        text: `Contribution of ${params.amount} ${params.currency} initiated for ${community.name}. PayPal Payment ID: ${payment.id}. Approval URL: ${payment.links?.find(l => l.rel === 'approval_url')?.href}`,
      }],
    };
  } catch (error) {
    console.error('[MCP] contribute error:', error);
    return { content: [{ type: 'text', text: `Failed to process contribution: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

async function handleDistributeFunds(params: z.infer<typeof distributeFundsInputSchema>): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
      with: { members: true },
    });

    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    if (community.members.length === 0) {
      return { content: [{ type: 'text', text: 'No members to distribute to' }], isError: true };
    }

    const totalFunds = Number(community.totalFunds);
    if (totalFunds <= 0) {
      return { content: [{ type: 'text', text: 'No funds available for distribution' }], isError: true };
    }

    const totalShares = community.members.reduce((sum, m) => sum + Number(m.sharePercentage), 0);
    const recipients = community.members
      .filter(m => m.isActive && m.userId)
      .map(m => ({
        email: m.email,
        share: (totalFunds * Number(m.sharePercentage) / totalShares).toFixed(2),
        name: m.name,
      }));

    const senderBatchId = `dist_${community.id}_${Date.now()}`;
    const payout = await createSplitPayment({
      senderBatchId,
      emailSubject: `Distribution from ${community.name}`,
      items: recipients.map(r => ({
        recipient_type: 'EMAIL' as const,
        amount: { value: r.share, currency: community.currency },
        receiver: r.email,
        note: r.name ?? undefined,
      })),
    });

    await db.insert(distributions).values({
      communityId: params.community_id,
      totalAmount: totalFunds.toFixed(2),
      currency: community.currency,
      paypalPayoutBatchId: payout.batch_header.payout_batch_id,
      status: 'completed',
      triggeredBy: params.triggered_by || 'agent',
      completedAt: new Date(),
    });

    for (const member of community.members.filter(m => m.isActive && m.userId)) {
      const share = (totalFunds * Number(member.sharePercentage) / totalShares);
      await db.insert(transactions).values({
        userId: member.userId!,
        type: 'distribution',
        amount: share.toFixed(2),
        currency: community.currency,
        description: `Distribution from ${community.name}`,
        referenceId: params.community_id,
        referenceType: 'community',
        paypalTransactionId: payout.batch_header.payout_batch_id,
        status: 'completed',
      });
    }

    await db.update(communities)
      .set({ totalFunds: '0', updatedAt: new Date() })
      .where(eq(communities.id, params.community_id));

    return {
      content: [{
        type: 'text',
        text: `Distributed ${totalFunds} ${community.currency} to ${recipients.length} members of ${community.name}. Payout Batch ID: ${payout.batch_header.payout_batch_id}`,
      }],
    };
  } catch (error) {
    console.error('[MCP] distribute_funds error:', error);
    return { content: [{ type: 'text', text: `Failed to distribute funds: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

async function handleGetCommunityState(params: z.infer<typeof getCommunityStateInputSchema>): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
      with: {
        members: true,
        contributions: { orderBy: (c, { desc }) => [desc(c.contributedAt)], limit: 50 },
        distributions: { orderBy: (d, { desc }) => [desc(d.createdAt)], limit: 20 },
      },
    });

    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    const totalContributions = community.contributions
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const completedDistributions = community.distributions.filter(d => d.status === 'completed');
    const totalDistributed = completedDistributions.reduce((sum, d) => sum + Number(d.totalAmount), 0);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          id: community.id,
          name: community.name,
          description: community.description,
          ownerId: community.ownerId,
          monthlyContribution: community.monthlyContribution,
          currency: community.currency,
          autoDistribute: community.autoDistribute,
          trustScore: community.trustScore,
          totalFunds: community.totalFunds,
          isActive: community.isActive,
          createdAt: community.createdAt,
          members: community.members.map(m => ({
            id: m.id, email: m.email, name: m.name,
            sharePercentage: m.sharePercentage, totalContributed: m.totalContributed,
            trustScore: m.trustScore, isActive: m.isActive, joinedAt: m.joinedAt,
          })),
          recentContributions: community.contributions.map(c => ({
            id: c.id, memberId: c.memberId, amount: c.amount, currency: c.currency,
            status: c.status, contributedAt: c.contributedAt,
          })),
          recentDistributions: community.distributions.map(d => ({
            id: d.id, totalAmount: d.totalAmount, currency: d.currency,
            status: d.status, triggeredBy: d.triggeredBy,
            createdAt: d.createdAt, completedAt: d.completedAt,
          })),
          summary: {
            memberCount: community.members.length,
            totalContributions, totalDistributed,
            completionRate: community.distributions.length > 0
              ? completedDistributions.length / community.distributions.length : 0,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error('[MCP] get_community_state error:', error);
    return { content: [{ type: 'text', text: `Failed to get community state: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

async function handleAnalyzeTrust(params: z.infer<typeof analyzeTrustInputSchema>): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
      with: { members: true, contributions: true },
    });

    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    const memberCount = community.members.length;
    const totalContributions = community.contributions
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const avgContribution = memberCount > 0 ? totalContributions / memberCount : 0;
    const contributionConsistency = community.contributions.length > 0
      ? community.contributions.filter(c => c.status === 'completed').length / community.contributions.length
      : 0;

    let trustScore = 50;
    trustScore += Math.min(memberCount * 2, 20);
    trustScore += Math.min(avgContribution / 100 * 10, 15);
    trustScore += contributionConsistency * 15;
    trustScore = Math.max(0, Math.min(100, Math.round(trustScore)));

    await db.update(communities)
      .set({ trustScore, updatedAt: new Date() })
      .where(eq(communities.id, params.community_id));

    return {
      content: [{
        type: 'text',
        text: `Trust analysis complete. Community: ${community.name}. Trust Score: ${trustScore}/100. Factors: ${memberCount} members, $${avgContribution.toFixed(2)} avg contribution, ${(contributionConsistency * 100).toFixed(0)}% consistency.`,
      }],
    };
  } catch (error) {
    console.error('[MCP] analyze_trust error:', error);
    return { content: [{ type: 'text', text: `Failed to analyze trust: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

// ============================================
// Tool Definitions
// ============================================

export const createChamaTool = {
  name: 'create_chama',
  description: 'Create a new savings community (chama) with members',
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255 },
      owner_email: { type: 'string', format: 'email' },
      monthly_contribution: { type: 'number', minimum: 0.01 },
      currency: { type: 'string', enum: ['USD', 'KES', 'NGN', 'PYUSD'], default: 'USD' },
      member_emails: { type: 'array', items: { type: 'string', format: 'email' }, minItems: 1, maxItems: 50 },
      auto_distribute: { type: 'boolean', default: false },
    },
    required: ['name', 'owner_email', 'monthly_contribution', 'member_emails'],
  },
  handler: handleCreateChama,
} as const;

export const joinChamaTool = {
  name: 'join_chama',
  description: 'Join an existing community',
  inputSchema: {
    type: 'object' as const,
    properties: {
      community_id: { type: 'string', format: 'uuid' },
      user_email: { type: 'string', format: 'email' },
      share_percentage: { type: 'number', minimum: 0, maximum: 100 },
    },
    required: ['community_id', 'user_email'],
  },
  handler: handleJoinChama,
} as const;

export const contributeTool = {
  name: 'contribute',
  description: 'Make a contribution to a community',
  inputSchema: {
    type: 'object' as const,
    properties: {
      community_id: { type: 'string', format: 'uuid' },
      member_email: { type: 'string', format: 'email' },
      amount: { type: 'number', minimum: 0.01 },
      currency: { type: 'string', default: 'USD' },
    },
    required: ['community_id', 'member_email', 'amount'],
  },
  handler: handleContribute,
} as const;

export const distributeFundsTool = {
  name: 'distribute_funds',
  description: 'Trigger distribution of community funds to members',
  inputSchema: {
    type: 'object' as const,
    properties: {
      community_id: { type: 'string', format: 'uuid' },
      triggered_by: { type: 'string', enum: ['manual', 'auto', 'agent'] },
    },
    required: ['community_id'],
  },
  handler: handleDistributeFunds,
} as const;

export const getCommunityStateTool = {
  name: 'get_community_state',
  description: 'Get full community state including members, contributions, and trust score',
  inputSchema: {
    type: 'object' as const,
    properties: { community_id: { type: 'string', format: 'uuid' } },
    required: ['community_id'],
  },
  handler: handleGetCommunityState,
} as const;

export const analyzeTrustTool = {
  name: 'analyze_trust',
  description: 'Run trust analysis on a community (updates trust score)',
  inputSchema: {
    type: 'object' as const,
    properties: { community_id: { type: 'string', format: 'uuid' } },
    required: ['community_id'],
  },
  handler: handleAnalyzeTrust,
} as const;

export const communityTools = [
  createChamaTool,
  joinChamaTool,
  contributeTool,
  distributeFundsTool,
  getCommunityStateTool,
  analyzeTrustTool,
] as const;

export const communityToolSchemas = {
  create_chama: createChamaInputSchema,
  join_chama: joinChamaInputSchema,
  contribute: contributeInputSchema,
  distribute_funds: distributeFundsInputSchema,
  get_community_state: getCommunityStateInputSchema,
  analyze_trust: analyzeTrustInputSchema,
} as const;