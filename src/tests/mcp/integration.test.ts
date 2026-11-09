import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/mcp/route';
import { clearRateLimit } from '@/lib/mcp/auth';
import { registerSSESession, unregisterSSESession, listSSESessions } from '@/lib/mcp/sse';

const TEST_KEY = 'test-integration-key';

vi.mock('@/lib/paypal', () => ({
  createPayment: vi.fn(async () => ({
    id: 'PAY-TEST-123',
    links: [{ rel: 'approval_url', href: 'https://www.sandbox.paypal.com/approve' }],
  })),
  createSplitPayment: vi.fn(async () => ({
    batch_header: { payout_batch_id: 'BATCH-TEST-1' },
  })),
  createPayout: vi.fn(),
}));

// echo-insert mock: values(v) => returning rows echoing v with a generated id
vi.mock('@/db', () => {
  const echoRow = (v: Record<string, unknown>) => ({
    id: `gen-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...v,
  });

  return {
    db: {
      query: {
        users: { findFirst: vi.fn(async () => undefined) },
        communities: { findFirst: vi.fn(async () => undefined) },
        communityMembers: { findFirst: vi.fn(async () => undefined) },
        gigJobs: { findFirst: vi.fn(async () => undefined) },
        gigMilestones: { findFirst: vi.fn(async () => undefined) },
      },
      select: vi.fn(() => ({
        from: () => ({
          where: () => ({
            limit: async () => [],
          }),
        }),
      })),
      insert: vi.fn(() => ({
        values: (v: Record<string, unknown>) => ({
          returning: vi.fn(async () => [echoRow(v)]),
        }),
      })),
      update: vi.fn(() => ({
        set: () => ({
          where: vi.fn(async () => undefined),
        }),
      })),
    },
  };
});

import { db } from '@/db';

const mockedDb = db as unknown as {
  query: Record<string, { findFirst: ReturnType<typeof vi.fn> }>;
  select: ReturnType<typeof vi.fn>;
};

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': TEST_KEY, ...headers },
    body: JSON.stringify(body),
  }) as never;
}

async function callMCP(body: unknown, headers?: Record<string, string>) {
  const res = await POST(makeRequest(body, headers));
  return {
    status: res.status,
    headers: res.headers,
    body: await res.json(),
  };
}

beforeAll(() => {
  process.env.MCP_API_KEYS = JSON.stringify({ [TEST_KEY]: 'test-user' });
});

beforeEach(() => {
  clearRateLimit(TEST_KEY);
  // Reset per-test query overrides so default "not found" behavior applies
  for (const repo of Object.values(mockedDb.query)) {
    repo.findFirst.mockReset();
  }
  mockedDb.select.mockReset();
  mockedDb.select.mockImplementation(() => ({
    from: () => ({
      where: () => ({
        limit: async () => [],
      }),
    }),
  }));
});

const communityFixture = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Distribute Chama',
  totalFunds: '200',
  currency: 'USD',
  members: [
    {
      id: 'member-1',
      email: 'm@example.com',
      userId: 'u1',
      sharePercentage: '100',
      totalContributed: '200',
      isActive: true,
      name: 'Member A',
    },
  ],
};

describe('MCP HTTP Endpoint Integration', () => {
  describe('protocol flows', () => {
    it('initialize returns protocol version, capabilities, serverInfo', async () => {
      const { status, body } = await callMCP({ jsonrpc: '2.0', id: 1, method: 'initialize' });
      expect(status).toBe(200);
      expect(body.result.protocolVersion).toBe('2024-11-05');
      expect(body.result.capabilities).toHaveProperty('tools');
      expect(body.result.serverInfo).toEqual({ name: 'chama-ai', version: '1.0.0' });
    });

    it('tools/list returns all 9 tools', async () => {
      const { body } = await callMCP({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
      const names = body.result.tools.map((t: { name: string }) => t.name);
      expect(names).toHaveLength(9);
      expect(names).toContain('create_chama');
      expect(names).toContain('complete_milestone');
      expect(names).toContain('distribute_yield');
    });

    it('malformed JSON body returns parse error 400', async () => {
      const res = await new Request('http://localhost:3000/api/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': TEST_KEY },
        body: '{invalid json',
      }) as never;
      const parsed = await POST(res);
      expect(parsed.status).toBe(400);
      const body = await parsed.json();
      expect(body.error.code).toBe(-32700);
    });

    it('missing API key returns 401 with WWW-Authenticate', async () => {
      const { status, headers, body } = await callMCP(
        { jsonrpc: '2.0', id: 3, method: 'initialize' },
        { 'x-api-key': '' }
      );
      expect(status).toBe(401);
      expect(headers.get('www-authenticate')).toContain('Bearer');
      expect(body.error).toBeDefined();
    });

    it('invalid API key returns 403', async () => {
      const { status } = await callMCP(
        { jsonrpc: '2.0', id: 4, method: 'initialize' },
        { 'x-api-key': 'wrong-key-123' }
      );
      expect(status).toBe(403);
    });

    it('unknown tool returns -32601', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: { name: 'nonexistent_tool', arguments: {} },
      });
      expect(body.error.code).toBe(-32601);
    });

    it('invalid tool params return -32602', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: { name: 'create_chama', arguments: { name: '' } },
      });
      expect(body.error.code).toBe(-32602);
    });
  });

  describe('community tools via tools/call', () => {
    it('create_chama creates owner, community, and members', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 10,
        method: 'tools/call',
        params: {
          name: 'create_chama',
          arguments: {
            name: 'Integration Chama',
            owner_email: 'owner@example.com',
            monthly_contribution: 100,
            member_emails: ['a@example.com', 'b@example.com'],
          },
        },
      });
      expect(body.error).toBeUndefined();
      expect(body.result.content[0].text).toContain('Created chama "Integration Chama"');
    });

    it('join_chama requires existing community (not found error)', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 11,
        method: 'tools/call',
        params: {
          name: 'join_chama',
          arguments: {
            community_id: '123e4567-e89b-12d3-a456-426614174000',
            user_email: 'user@example.com',
          },
        },
      });
      expect(body.result.isError).toBe(true);
      expect(body.result.content[0].text).toContain('Community not found');
    });

    it('contribute triggers PayPal payment and records contribution', async () => {
      mockedDb.query.communities.findFirst.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Pay Chama',
        totalFunds: '100',
        currency: 'USD',
        members: [
          {
            id: 'member-1',
            email: 'm@example.com',
            userId: 'u1',
            sharePercentage: '100',
            totalContributed: '0',
            isActive: true,
          },
        ],
      });

      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 12,
        method: 'tools/call',
        params: {
          name: 'contribute',
          arguments: {
            community_id: '123e4567-e89b-12d3-a456-426614174000',
            member_email: 'm@example.com',
            amount: 50,
          },
        },
      });
      expect(body.error).toBeUndefined();
      expect(body.result.content[0].text).toContain('PAY-TEST-123');
      expect(body.result.content[0].text).toContain('Approval URL:');
    });

    it('distribute_funds pays out and streams SSE progress when session_id provided', async () => {
      mockedDb.query.communities.findFirst.mockResolvedValue(communityFixture);

      // register a fake SSE session to capture progress
      const sessionId = 'integration-sse';
      const received: Array<{ event: string; data: unknown }> = [];
      registerSSESession({
        id: sessionId,
        send: (event, data) => received.push({ event, data }),
        close: () => {},
        createdAt: Date.now(),
        lastPingAt: Date.now(),
      });

      try {
        const { body } = await callMCP({
          jsonrpc: '2.0',
          id: 13,
          method: 'tools/call',
          params: {
            name: 'distribute_funds',
            arguments: {
              community_id: '123e4567-e89b-12d3-a456-426614174000',
              session_id: sessionId,
            },
          },
        });

        expect(body.error).toBeUndefined();
        expect(body.result.content[0].text).toContain('BATCH-TEST-1');

        const steps = received.map(e => (e.data as { step: string }).step);
        expect(steps).toEqual(['validated', 'payout_submitted', 'completed']);
      } finally {
        unregisterSSESession(sessionId);
      }
    });

    it('distribute_funds blocks retry while a payout is still pending (idempotency)', async () => {
      mockedDb.query.communities.findFirst.mockResolvedValue(communityFixture);
      mockedDb.select.mockImplementation(() => ({
        from: () => ({
          where: () => ({
            limit: async () => [
              { id: 'pending-row-1', status: 'processing', paypalPayoutBatchId: 'BATCH-EXISTING' },
            ],
          }),
        }),
      }));

      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 15,
        method: 'tools/call',
        params: {
          name: 'distribute_funds',
          arguments: { community_id: '123e4567-e89b-12d3-a456-426614174000' },
        },
      });

      expect(body.result.isError).toBe(true);
      expect(body.result.content[0].text).toContain('already in progress');
      expect(body.result.content[0].text).toContain('BATCH-EXISTING');
    });

    it('get_community_state requires existing community', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 14,
        method: 'tools/call',
        params: {
          name: 'get_community_state',
          arguments: { community_id: '123e4567-e89b-12d3-a456-426614174000' },
        },
      });
      expect(body.result.isError).toBe(true);
      expect(body.result.content[0].text).toContain('Community not found');
    });
  });

  describe('gig tools via tools/call', () => {
    it('create_gig_job creates job with computed milestones', async () => {
      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 20,
        method: 'tools/call',
        params: {
          name: 'create_gig_job',
          arguments: {
            title: 'Integration Gig',
            freelancer_email: 'freelancer@example.com',
            client_email: 'client@example.com',
            total_budget: 1000,
            milestones: [
              { name: 'Design', percentage: 40 },
              { name: 'Development', percentage: 60 },
            ],
          },
        },
      });
      expect(body.error).toBeUndefined();
      const text = body.result.content[0].text;
      expect(text).toContain('Created gig job "Integration Gig"');
      expect(text).toContain('400.00'); // 40% of 1000
      expect(text).toContain('600.00'); // last milestone absorbs remainder
    });

    it('complete_milestone pays freelancer and reports progress', async () => {
      mockedDb.query.gigJobs.findFirst.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Integration Gig',
        freelancerId: 'freelancer-id',
        clientEmail: 'client@example.com',
        totalBudget: '1000',
        currency: 'USD',
        status: 'active',
        milestones: [
          {
            id: 'ms-1',
            name: 'Design',
            percentage: 40,
            amount: '400.00',
            isCompleted: false,
            createdAt: new Date(),
          },
          {
            id: 'ms-2',
            name: 'Development',
            percentage: 60,
            amount: '600.00',
            isCompleted: false,
            createdAt: new Date(),
          },
        ],
      });
      mockedDb.query.users.findFirst.mockResolvedValue({
        id: 'freelancer-id',
        email: 'freelancer@example.com',
        fullName: 'Freelancer',
      });

      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 21,
        method: 'tools/call',
        params: {
          name: 'complete_milestone',
          arguments: {
            job_id: '123e4567-e89b-12d3-a456-426614174001',
            milestone_index: 1,
          },
        },
      });
      expect(body.error).toBeUndefined();
      const text = body.result.content[0].text;
      expect(text).toContain('Milestone "Design" completed');
      expect(text).toContain('freelancer@example.com');
      expect(text).toContain('BATCH-TEST-1');
      expect(text).toContain('Progress: 1/2');
    });

    it('complete_milestone rejects out-of-range index', async () => {
      mockedDb.query.gigJobs.findFirst.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174002',
        title: 'Small Gig',
        freelancerId: 'freelancer-id',
        status: 'active',
        currency: 'USD',
        milestones: [
          { id: 'ms-1', name: 'Only', percentage: 100, amount: '500.00', isCompleted: false, createdAt: new Date() },
        ],
      });
      mockedDb.query.users.findFirst.mockResolvedValue({ id: 'f', email: 'f@e.com', fullName: 'F' });

      const { body } = await callMCP({
        jsonrpc: '2.0',
        id: 22,
        method: 'tools/call',
        params: {
          name: 'complete_milestone',
          arguments: {
            job_id: '123e4567-e89b-12d3-a456-426614174002',
            milestone_index: 5,
          },
        },
      });
      expect(body.result.isError).toBe(true);
      expect(body.result.content[0].text).toContain('out of range');
    });
  });
});
