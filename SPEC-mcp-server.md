# Spec: MCP Server for PayPal Agent Toolkit

## Objective

Build a Model Context Protocol (MCP) server that exposes Cham.ai's financial agent capabilities to external AI agents (ChatGPT, Perplexity, custom agents, PayPal's agent toolkit). This enables agent-to-agent (A2A) commerce where external agents can create/join communities, make contributions, trigger distributions, and manage gig escrow — all via standardized MCP tools.

**User Stories:**
- As an external AI agent, I can discover Cham.ai's capabilities via `tools/list`
- As an external AI agent, I can create a savings circle (chama) for a user
- As an external AI agent, I can join a user to an existing community
- As an external AI agent, I can process contributions and trigger distributions
- As an external AI agent, I can query community state and trust scores
- As an external AI agent, I can create and manage gig escrow contracts
- As a PayPal agent toolkit user, I can access Cham.ai tools natively via MCP

**Success Criteria:**
- MCP server responds to `initialize`, `tools/list`, `tools/call` per JSON-RPC 2.0
- All 8 tools exposed with proper input schemas (Zod-validated)
- Tools correctly delegate to existing LangChain agent + PayPal SDK
- API key authentication with rate limiting (100 req/min per key)
- SSE endpoint for streaming long-running operations
- `.well-known/agentic-commerce.json` manifest published
- `llms.txt` generated for AI crawler discovery
- 100% test coverage for protocol handlers

## Tech Stack

- **Framework:** Next.js 14 (App Router) — API routes at `src/app/api/mcp/`
- **Protocol:** MCP (JSON-RPC 2.0 over HTTP + SSE)
- **Validation:** Zod for tool input schemas
- **Auth:** API key header (`x-api-key`) + HMAC request signing
- **Database:** Drizzle ORM + PostgreSQL (existing schema)
- **Payments:** PayPal REST SDK (existing `src/lib/paypal.ts`)
- **Agent:** LangChain + OpenAI (existing `src/lib/agent.ts`)
- **Testing:** Vitest + Supertest for API routes

## Commands

```bash
# Development
npm run dev                    # Starts Next.js on localhost:3000
npm run dev:mcp               # Starts MCP test client

# Testing
npm test                      # Unit tests (vitest)
npm test:mcp                  # MCP integration tests
npm run test:coverage         # Coverage report

# Linting
npm run lint                  # ESLint + Prettier
npm run typecheck             # TypeScript strict check

# Build
npm run build                 # Next.js production build

# MCP-specific
npm run mcp:inspect           # MCP inspector CLI
npm run mcp:generate-llms     # Generate llms.txt
```

## Project Structure

```
src/
├── app/
│   └── api/
│       └── mcp/
│           ├── route.ts              # Main MCP HTTP endpoint (POST)
│           ├── sse/route.ts          # SSE streaming endpoint (GET)
│           ├── well-known/
│           │   └── agentic-commerce/route.ts  # Discovery manifest
│           └── llms.txt/route.ts     # AI crawler discovery
├── lib/
│   ├── mcp/
│   │   ├── protocol.ts               # JSON-RPC 2.0 request/response types
│   │   ├── server.ts                 # MCP server core (method routing)
│   │   ├── tools/
│   │   │   ├── index.ts              # Tool registry & definitions
│   │   │   ├── community.ts          # Community tools (create, join, contribute, distribute, state, trust)
│   │   │   └── gig.ts                # Gig tools (create_job, complete_milestone)
│   │   ├── auth.ts                   # API key validation, rate limiting
│   │   ├── sse.ts                    # SSE connection management
│   │   └── discovery.ts              # Manifest & llms.txt generation
│   └── mcp-client.ts                 # Test client for development
├── types/
│   └── mcp.ts                        # Shared TypeScript types
└── tests/
    ├── mcp/
    │   ├── protocol.test.ts          # JSON-RPC handling
    │   ├── tools.test.ts             # Tool execution
    │   ├── auth.test.ts              # Auth & rate limiting
    │   └── integration.test.ts       # End-to-end MCP flows
    └── fixtures/
        └── test-agents.ts            # Mock agent configurations
```

## Code Style

```typescript
// Example: Tool handler pattern
// File: src/lib/mcp/tools/community.ts

import { z } from 'zod';
import { createFinancialAgent } from '@/lib/agent';

export const createChamaTool = {
  name: 'create_chama',
  description: 'Create a new savings community (chama) with members',
  inputSchema: z.object({
    name: z.string().min(1).max(255),
    owner_email: z.string().email(),
    monthly_contribution: z.number().positive(),
    currency: z.enum(['USD', 'KES', 'NGN', 'PYUSD']).default('USD'),
    member_emails: z.array(z.string().email()).min(1).max(50),
    auto_distribute: z.boolean().default(false),
  }),
  handler: async (params: z.infer<typeof createChamaTool.inputSchema>) => {
    const agent = createFinancialAgent(params.owner_email);
    const result = await agent.invoke({
      input: `Create a chama named "${params.name}" with monthly contribution ${params.monthly_contribution} ${params.currency} for members: ${params.member_emails.join(', ')}. Auto-distribute: ${params.auto_distribute}`,
    });
    return { content: [{ type: 'text', text: result.output }] };
  },
} as const;
```

**Key Conventions:**
- Tools are `const` objects with `name`, `description`, `inputSchema` (Zod), `handler`
- Handlers return MCP `CallToolResult` format: `{ content: [{ type: 'text', text: string }] }`
- Errors thrown as `MCPError` with `code`, `message`, `data`
- All async operations use `try/catch` with structured logging
- No `any` types — strict TypeScript with explicit generics

## Testing Strategy

| Level | Framework | Location | Coverage Target |
|-------|-----------|----------|-----------------|
| Unit | Vitest | `src/tests/mcp/*.test.ts` | 90%+ |
| Integration | Vitest + Supertest | `src/tests/mcp/integration.test.ts` | 80%+ |
| Contract | MCP Inspector | Manual/CI | 100% of spec methods |

**Test Pyramid:**
- Unit: Protocol parsing, tool schema validation, auth logic (fast, isolated)
- Integration: Full HTTP request/response cycles with test DB
- Contract: Verify compliance with MCP spec (initialize, tools/list, tools/call)

**Key Test Scenarios:**
1. `initialize` returns protocol version + capabilities
2. `tools/list` returns all 8 tools with correct schemas
3. `tools/call` executes each tool and returns valid result
4. Invalid tool name returns `-32601` Method not found
5. Invalid params returns `-32602` Invalid params
6. Auth: missing API key → 401, invalid key → 403, rate limit → 429
6. SSE: connection established, events streamed, cleanup on disconnect

## Boundaries

### Always Do
- Run `npm test` before committing MCP changes
- Validate all tool inputs with Zod schemas
- Log all MCP requests (method, params, duration, result/error)
- Use existing LangChain agent + PayPal SDK (no duplicate logic)
- Follow MCP JSON-RPC 2.0 spec exactly

### Ask First
- Adding new MCP methods beyond the 3 standard ones
- Changing tool input/output schemas (breaks client compatibility)
- Modifying authentication scheme
- Adding database migrations for MCP-specific tables

### Never Do
- Commit API keys or secrets to repository
- Skip Zod validation in handlers
- Return raw errors to clients (wrap in MCP error format)
- Block the event loop in handlers (use async throughout)
- Modify `src/lib/agent.ts` or `src/lib/paypal.ts` without security review

## Success Criteria

### Protocol Compliance
- [ ] `initialize` returns `protocolVersion: "2024-11-05"`, `capabilities: { tools: {} }`, `serverInfo`
- [ ] `tools/list` returns array of 8 tool definitions matching schema
- [ ] `tools/call` with valid params returns `{ content: [{ type: 'text', text: string }] }`
- [ ] `tools/call` with invalid tool returns error code `-32601`
- [ ] `tools/call` with invalid params returns error code `-32602`

### Tool Functionality
- [ ] `create_chama` creates community in DB, returns community ID
- [ ] `join_chama` adds member, returns membership details
- [ ] `contribute` records contribution, triggers PayPal payment
- [ ] `distribute_funds` triggers distribution, returns batch ID
- [ ] `get_community_state` returns full community + members + contributions
- [ ] `analyze_trust` calculates and updates trust score
- [ ] `create_gig_job` creates gig with milestones
- [ ] `complete_milestone` marks milestone, triggers payment if all done

### Auth & Rate Limiting
- [ ] Missing `x-api-key` header → 401 with `WWW-Authenticate`
- [ ] Invalid API key → 403
- [ ] Exceeds 100 req/min → 429 with `Retry-After`
- [ ] Valid key → request proceeds, logged with key ID

### Discovery
- [ ] `GET /.well-known/agentic-commerce.json` returns valid manifest
- [ ] `GET /api/mcp/llms.txt` returns formatted tool descriptions
- [ ] Manifest includes all endpoints, capabilities, trust signals

### Observability
- [ ] All requests logged with: method, tool (if tools/call), user_id, duration_ms, status
- [ ] Errors logged with full stack trace
- [ ] Metrics exposed: requests_total, errors_total, latency_p95

## Open Questions

1. **API Key Management:** Should keys be stored in DB with user association, or use a simple env-based allowlist for MVP?
2. **SSE Use Case:** Which tools need streaming? Currently only `distribute_funds` might take >30s.
3. **PayPal Agent Toolkit Integration:** Does PayPal's toolkit require specific MCP extensions beyond standard spec?
4. **Rate Limit Storage:** In-memory (Redis) vs. DB? MVP can use in-memory with Redis upgrade path.
5. **Tool Versioning:** How to handle schema evolution? MCP doesn't specify — need strategy.

---

**Ready for review.** Please approve or request changes before I proceed to Phase 2 (Planning).