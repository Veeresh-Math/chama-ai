import type { Tool } from '@/types/mcp';

const MCP_ENDPOINT = '/api/mcp';
const SSE_ENDPOINT = '/api/mcp/sse';
const DISCOVERY_ENDPOINT = '/.well-known/agentic-commerce.json';
const LLMS_TXT_ENDPOINT = '/api/mcp/llms.txt';

const MCP_PROTOCOL_VERSION = '2024-11-05';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export interface ACPManifest {
  protocol_version: string;
  name: string;
  description: string;
  merchant_id: string;
  endpoints: {
    mcp: string;
    sse: string;
    discovery: string;
    llms_txt: string;
  };
  capabilities: {
    tools: string[];
    streaming: boolean;
    protocol_version: string;
    auth: {
      type: 'api_key';
      header: 'x-api-key';
      rate_limit: { requests: number; window: string };
    };
  };
  categories: string[];
  trust_signals: Record<string, unknown>;
}

export function buildACPManifest(tools: Tool[]): ACPManifest {
  const baseUrl = getBaseUrl();
  return {
    protocol_version: MCP_PROTOCOL_VERSION,
    name: 'Cham.ai',
    description:
      'AI-powered wealth collective platform: community savings circles (chamas), investment pools, and gig-worker milestone escrow with PayPal/PYUSD settlement.',
    merchant_id: process.env.MCP_MERCHANT_ID || 'chama-ai-alpha',
    endpoints: {
      mcp: `${baseUrl}${MCP_ENDPOINT}`,
      sse: `${baseUrl}${SSE_ENDPOINT}`,
      discovery: `${baseUrl}${DISCOVERY_ENDPOINT}`,
      llms_txt: `${baseUrl}${LLMS_TXT_ENDPOINT}`,
    },
    capabilities: {
      tools: tools.map(t => t.name),
      streaming: tools.length > 0,
      protocol_version: MCP_PROTOCOL_VERSION,
      auth: {
        type: 'api_key',
        header: 'x-api-key',
        rate_limit: { requests: 100, window: '1 minute' },
      },
    },
    categories: ['financial_services', 'community_finance', 'payments', 'gig_economy'],
    trust_signals: {
      payments_provider: 'paypal',
      settlement_methods: ['paypal_payouts', 'pyusd_stablecoin'],
      currencies: ['USD', 'KES', 'NGN', 'PYUSD'],
      buyer_protection: 'PayPal milestone escrow for gig payments',
      trust_scoring: 'Community + member trust scores (0-100) with contribution-consistency analysis',
      idempotency: 'Payout batch IDs derived from community/milestone IDs to prevent double payment',
    },
  };
}

export function buildLlmsTxt(tools: Tool[]): string {
  const baseUrl = getBaseUrl();
  const lines: string[] = [];

  lines.push('# Cham.ai MCP Server');
  lines.push('');
  lines.push(
    'Agent-to-agent commerce API for community savings circles (chamas), contributions, fund distributions, and gig-work milestone escrow. Powered by PayPal payouts and PYUSD.'
  );
  lines.push('');
  lines.push('## Endpoint');
  lines.push('');
  lines.push(`- MCP (JSON-RPC 2.0 over HTTP): ${baseUrl}${MCP_ENDPOINT}`);
  lines.push(`- SSE streaming: ${baseUrl}${SSE_ENDPOINT}?session_id=<your-session-id>`);
  lines.push(`- Discovery manifest: ${baseUrl}${DISCOVERY_ENDPOINT}`);
  lines.push('');
  lines.push('## Authentication');
  lines.push('');
  lines.push('Send your API key in the `x-api-key` header on every request:');
  lines.push('');
  lines.push('```');
  lines.push('x-api-key: <your-api-key>');
  lines.push('```');
  lines.push('');
  lines.push('Keys map to user IDs via the `MCP_API_KEYS` env allowlist. Rate limit: 100 requests/minute per key (HTTP 429 with `Retry-After` otherwise).');
  lines.push('');
  lines.push('## Usage');
  lines.push('');
  lines.push('POST JSON-RPC 2.0 requests. Example `tools/call`:');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'create_chama', arguments: {} },
  }, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Tools');
  lines.push('');

  for (const tool of tools) {
    lines.push(`### ${tool.name}`);
    lines.push('');
    lines.push(tool.description);
    lines.push('');
    const required = new Set(tool.inputSchema.required ?? []);
    for (const [param, schema] of Object.entries(tool.inputSchema.properties ?? {})) {
      const s = schema as Record<string, unknown>;
      const type = (s.type as string | undefined) ?? 'object';
      const req = required.has(param) ? ' (required)' : ' (optional)';
      const enumHint = Array.isArray(s.enum) ? `, one of: ${s.enum.join(', ')}` : '';
      const desc = typeof s.description === 'string' ? ` — ${s.description}` : '';
      lines.push(`- \`${param}\` (${type}${req}${enumHint})${desc}`);
    }
    lines.push('');
  }

  lines.push('## Example: create a savings circle');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'create_chama',
      arguments: {
        name: 'Nairobi Savers',
        owner_email: 'owner@example.com',
        monthly_contribution: 50,
        currency: 'USD',
        member_emails: ['a@example.com', 'b@example.com'],
        auto_distribute: false,
      },
    },
  }, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Example: create gig escrow and release a milestone');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'create_gig_job',
      arguments: {
        title: 'Build landing page',
        freelancer_email: 'dev@example.com',
        client_email: 'client@example.com',
        total_budget: 1000,
        milestones: [
          { name: 'Design', percentage: 40 },
          { name: 'Development', percentage: 60 },
        ],
      },
    },
  }, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Streaming long-running operations');
  lines.push('');
  lines.push('`distribute_funds` accepts an optional `session_id`. Open an SSE connection first, then pass the same `session_id` to receive `progress` events (validated → payout_submitted → completed).');
  lines.push('');
  lines.push('## Troubleshooting');
  lines.push('');
  lines.push('- 401: missing API key — add the `x-api-key` header');
  lines.push('- 403: invalid API key');
  lines.push('- 429: rate limit exceeded — honor `Retry-After`');
  lines.push('- -32601: unknown tool or method');
  lines.push('- -32602: validate arguments against the tool schema above');
  lines.push('');

  return lines.join('\n');
}
