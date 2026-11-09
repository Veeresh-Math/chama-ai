import { z } from 'zod';
import { CallToolResult } from '@/types/mcp';
import { db } from '@/db';
import { communities, communityMembers, communityYieldVaults, yieldDistributions, transactions } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { createSplitPayment } from '@/lib/paypal';
import { sendMCPProgress } from '@/lib/mcp/sse';
import { withKYA } from '@/lib/mcp/kya';

export const distributeYieldInputSchema = z.object({
  community_id: z.string().uuid(),
  agent_id: z.string().min(1),
  session_id: z.string().min(8).max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});

async function handleDistributeYield(
  params: z.infer<typeof distributeYieldInputSchema>,
  kya: { verified: boolean; agentId?: string; agentName?: string }
): Promise<CallToolResult> {
  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, params.community_id),
      with: { members: true },
    });
    if (!community) {
      return { content: [{ type: 'text', text: `Community not found: ${params.community_id}` }], isError: true };
    }

    const vault = await db.query.communityYieldVaults.findFirst({
      where: eq(communityYieldVaults.communityId, params.community_id),
    });
    if (!vault) {
      return {
        content: [{ type: 'text', text: `No yield vault for community ${params.community_id}. Seed one first.` }],
        isError: true,
      };
    }

    const pending = await db
      .select()
      .from(yieldDistributions)
      .where(
        and(
          eq(yieldDistributions.communityId, params.community_id),
          or(eq(yieldDistributions.status, 'pending'), eq(yieldDistributions.status, 'processing'))
        )
      )
      .limit(1);
    if (pending.length > 0) {
      return { content: [{ type: 'text', text: `Yield distribution already in progress for ${community.name}` }], isError: true };
    }

    const totalFunds = Number(community.totalFunds);
    if (totalFunds <= 0) {
      return { content: [{ type: 'text', text: 'No funds available for yield' }], isError: true };
    }

    const daysSinceLast = vault.lastYieldDistributionAt
      ? (Date.now() - new Date(vault.lastYieldDistributionAt).getTime()) / (1000 * 60 * 60 * 24)
      : 30;
    const annualRate = vault.annualYieldRateBasisPoints / 10000;
    const yieldAmount = totalFunds * annualRate * (daysSinceLast / 365);

    if (yieldAmount < 0.01) {
      return { content: [{ type: 'text', text: `Yield too small to distribute ($${yieldAmount.toFixed(4)}). Accumulate more funds or time.` }] };
    }

    const totalShares = community.members.reduce((sum, m) => sum + Number(m.sharePercentage), 0);
    const recipients = community.members
      .filter(m => m.isActive && m.userId)
      .map(m => ({
        email: m.email,
        share: (yieldAmount * Number(m.sharePercentage) / totalShares).toFixed(2),
        name: m.name,
      }));

    sendMCPProgress(params.session_id, 'validated', `Yield validated: ${recipients.length} recipients, $${yieldAmount.toFixed(2)}`, {
      progress: 25,
      data: { recipients: recipients.length, yieldAmount },
    });

    const [pendingRow] = await db.insert(yieldDistributions).values({
      communityId: params.community_id,
      totalAmount: yieldAmount.toFixed(2),
      currency: vault.currency,
      status: 'pending',
      triggeredBy: 'agent',
    }).returning();

    const senderBatchId = `yield_${pendingRow.id}`;
    let payout;
    try {
      payout = await createSplitPayment({
        senderBatchId,
        emailSubject: `PYUSD Yield Distribution from ${community.name}`,
        items: recipients.map(r => ({
          recipient_type: 'EMAIL' as const,
          amount: { value: r.share, currency: vault.currency },
          receiver: r.email,
          note: r.name ?? undefined,
        })),
      });
    } catch (payError) {
      await db.update(yieldDistributions).set({ status: 'failed', completedAt: new Date() }).where(eq(yieldDistributions.id, pendingRow.id));
      throw payError;
    }

    sendMCPProgress(params.session_id, 'payout_submitted', `PayPal payout submitted: batch ${payout.batch_header.payout_batch_id}`, {
      progress: 70,
      data: { batch_id: payout.batch_header.payout_batch_id },
    });

    await db.update(yieldDistributions)
      .set({ status: 'completed', paypalPayoutBatchId: payout.batch_header.payout_batch_id, completedAt: new Date() })
      .where(eq(yieldDistributions.id, pendingRow.id));

    for (const member of community.members.filter(m => m.isActive && m.userId)) {
      const share = (yieldAmount * Number(member.sharePercentage) / totalShares);
      await db.insert(transactions).values({
        userId: member.userId!,
        type: 'yield',
        amount: share.toFixed(2),
        currency: vault.currency,
        description: `PYUSD yield from ${community.name}`,
        referenceId: params.community_id,
        referenceType: 'community',
        paypalTransactionId: payout.batch_header.payout_batch_id,
        status: 'completed',
      });
    }

    await db.update(communityYieldVaults)
      .set({
        totalYieldDistributed: (Number(vault.totalYieldDistributed) + yieldAmount).toFixed(2),
        lastYieldDistributionAt: new Date(),
      })
      .where(eq(communityYieldVaults.id, vault.id));

    sendMCPProgress(params.session_id, 'completed', `Yield distributed to ${recipients.length} members`, {
      progress: 100,
      data: { batch_id: payout.batch_header.payout_batch_id },
    });

    return {
      content: [{
        type: 'text',
        text: `Distributed $${yieldAmount.toFixed(2)} ${vault.currency} yield to ${recipients.length} members of ${community.name}. Payout Batch ID: ${payout.batch_header.payout_batch_id}. Triggered by agent ${kya.agentId} (${kya.agentName}).`,
      }],
    };
  } catch (error) {
    console.error('[MCP] distribute_yield error:', error);
    return { content: [{ type: 'text', text: `Failed to distribute yield: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
  }
}

export const distributeYieldTool = {
  name: 'distribute_yield',
  description: 'Distribute pro-rata PYUSD yield to community members (requires verified agent via KYA)',
  inputSchema: {
    type: 'object' as const,
    properties: {
      community_id: { type: 'string', format: 'uuid' },
      agent_id: { type: 'string', minLength: 1, description: 'Verified agent identity (KYA required)' },
      session_id: { type: 'string', minLength: 8, maxLength: 64, description: 'Optional SSE session id' },
    },
    required: ['community_id', 'agent_id'],
  },
  handler: withKYA(handleDistributeYield),
} as const;

export const yieldTools = [distributeYieldTool] as const;
export const yieldToolSchemas = {
  distribute_yield: distributeYieldInputSchema,
} as const;
