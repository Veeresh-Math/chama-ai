import { CallToolResult } from '@/types/mcp';
import { db } from '@/db';
import { agentIdentities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface KYAResult {
  verified: boolean;
  agentId?: string;
  agentName?: string;
  reason?: string;
}

export async function verifyAgent(agentId: string): Promise<KYAResult> {
  if (!agentId) {
    return { verified: false, reason: 'agent_id is required' };
  }
  const agent = await db.query.agentIdentities.findFirst({
    where: eq(agentIdentities.agentId, agentId),
  });
  if (!agent) {
    return { verified: false, agentId, reason: 'agent not registered' };
  }
  if (!agent.isVerified) {
    return { verified: false, agentId, agentName: agent.agentName ?? undefined, reason: 'agent not verified' };
  }
  return { verified: true, agentId: agent.agentId ?? '', agentName: agent.agentName ?? undefined };
}

export type KYAHandler<T = Record<string, unknown>> = (
  params: T,
  kya: KYAResult
) => Promise<CallToolResult>;

export function withKYA<T extends Record<string, unknown>>(
  handler: KYAHandler<T>
): (params: Record<string, unknown>) => Promise<CallToolResult> {
  return async (params) => {
    const agentId = typeof params.agent_id === 'string' ? params.agent_id : undefined;
    const kya = await verifyAgent(agentId!);
    if (!kya.verified) {
      return {
        content: [{ type: 'text', text: `KYA verification failed: ${kya.reason}` }],
        isError: true,
      };
    }
    return handler(params as T, kya);
  };
}

export async function optionalKYA<T extends Record<string, unknown>>(
  params: Record<string, unknown>,
  handler: (params: T, kya: KYAResult | null) => Promise<CallToolResult>
): Promise<CallToolResult> {
  const agentId = typeof params.agent_id === 'string' ? params.agent_id : undefined;
  if (!agentId) {
    return handler(params as T, null);
  }
  const kya = await verifyAgent(agentId);
  if (!kya.verified) {
    return {
      content: [{ type: 'text', text: `KYA verification failed: ${kya.reason}` }],
      isError: true,
    };
  }
  return handler(params as T, kya);
}
