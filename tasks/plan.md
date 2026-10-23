# Implementation Plan: MCP Server for PayPal Agent Toolkit

## Overview

Build a Model Context Protocol (MCP) server exposing Cham.ai's financial agent capabilities (8 tools) to external AI agents via JSON-RPC 2.0 over HTTP + SSE. The server integrates with existing LangChain agent, PayPal SDK, and Drizzle ORM.

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js API Routes** for MCP endpoints | Leverages existing Next.js 14 infrastructure; no separate server needed |
| **In-memory rate limiting** (upgrade to Redis later) | MVP simplicity; Redis adds ops complexity |
| **Env-based API key allowlist** for MVP | Avoids DB schema changes; keys mapped to user IDs in env |
| **SSE only for `distribute_funds`** | Only tool with >30s latency; others return fast |
| **Zod schemas as single source of truth** | Tool definitions auto-generate MCP schema + validation |
| **Existing LangChain agent as tool backend** | No duplicate business logic; agent already handles PayPal + DB |

## Task List

### Phase 1: Foundation (Protocol Core)

#### Task 1: MCP Protocol Types & JSON-RPC Handler
**Description:** Create shared TypeScript types for MCP (JSON-RPC 2.0 request/response) and the core protocol handler that routes `initialize`, `tools/list`, `tools/call`.

**Acceptance criteria:**
- [ ] `src/types/mcp.ts` defines `MCPRequest`, `MCPResponse`, `MCPError`, `Tool`, `CallToolResult`
- [ ] `src/lib/mcp/protocol.ts` exports `handleMCPRequest(request: MCPRequest): Promise<MCPResponse>`
- [ ] `initialize` returns protocol version, capabilities, serverInfo
- [ ] `tools/list` returns empty array (tools registered later)
- [ ] `tools/call` with unknown method returns `-32601`
- [ ] Invalid JSON-RPC returns `-32600`

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/protocol.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Unit tests cover all 3 methods + error cases

**Dependencies:** None

**Files likely touched:**
- `src/types/mcp.ts`
- `src/lib/mcp/protocol.ts`
- `src/tests/mcp/protocol.test.ts`

**Estimated scope:** S (2-3 files)

---

#### Task 2: MCP Server Core & Method Routing
**Description:** Build the main MCP server class that registers tools, handles method dispatch, and integrates with Next.js API route.

**Acceptance criteria:**
- [ ] `src/lib/mcp/server.ts` exports `MCPServer` class with `registerTool()`, `handleRequest()`
- [ ] Tool registry stores tool definitions (name, description, inputSchema, handler)
- [ ] `tools/list` returns all registered tools
- [ ] `tools/call` validates params against tool's Zod schema, executes handler, returns result
- [ ] Errors from handlers wrapped in MCP error format

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/server.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Register mock tool, call via handleRequest, verify response

**Dependencies:** Task 1

**Files likely touched:**
- `src/lib/mcp/server.ts`
- `src/tests/mcp/server.test.ts`

**Estimated scope:** S (2 files)

---

#### Task 3: API Key Authentication & Rate Limiting
**Description:** Implement API key validation middleware and in-memory rate limiter (100 req/min per key).

**Acceptance criteria:**
- [ ] `src/lib/mcp/auth.ts` exports `validateAPIKey(key: string): { valid: boolean; userId?: string }`
- [ ] `src/lib/mcp/auth.ts` exports `rateLimit(key: string): { allowed: boolean; retryAfter?: number }`
- [ ] Valid keys loaded from `MCP_API_KEYS` env (JSON: `{"key1": "user1", "key2": "user2"}`)
- [ ] Missing key → 401 with `WWW-Authenticate: Bearer`
- [ ] Invalid key → 403
- [ ] Rate limit exceeded → 429 with `Retry-After` header

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/auth.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: curl with/without key, verify headers

**Dependencies:** None (can parallelize with Task 1-2)

**Files likely touched:**
- `src/lib/mcp/auth.ts`
- `src/tests/mcp/auth.test.ts`

**Estimated scope:** S (2 files)

---

#### Task 4: Main MCP HTTP Endpoint (POST /api/mcp)
**Description:** Create Next.js API route that integrates auth, rate limiting, and protocol handler.

**Acceptance criteria:**
- [ ] `src/app/api/mcp/route.ts` handles POST requests
- [ ] Extracts `x-api-key` header, validates via auth module
- [ ] Applies rate limiting per key
- [ ] Parses JSON-RPC request, delegates to protocol handler
- [ ] Returns proper MCP response with correct status codes
- [ ] Logs all requests (method, tool, duration, status)

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/integration.test.ts` (endpoint tests)
- [ ] Build succeeds: `npm run build`
- [ ] Manual: `curl -X POST -H "x-api-key: test" -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}' http://localhost:3000/api/mcp`

**Dependencies:** Task 1, 2, 3

**Files likely touched:**
- `src/app/api/mcp/route.ts`
- `src/tests/mcp/integration.test.ts`

**Estimated scope:** S (2 files)

---

### Checkpoint: Foundation
- [ ] All foundation tests pass
- [ ] Application builds without errors
- [ ] `initialize` and `tools/list` work end-to-end via HTTP
- [ ] Auth and rate limiting enforced
- [ ] Review with human before proceeding

---

### Phase 2: Tool Implementation (Vertical Slices)

#### Task 5: Community Tool Definitions & Schemas
**Description:** Define Zod schemas and tool metadata for all 6 community tools.

**Acceptance criteria:**
- [ ] `src/lib/mcp/tools/community.ts` exports 6 tool definitions:
  - `create_chama`, `join_chama`, `contribute`, `distribute_funds`, `get_community_state`, `analyze_trust`
- [ ] Each has `name`, `description`, `inputSchema` (Zod), `handler` stub
- [ ] Schemas match SPEC exactly (field names, types, constraints)
- [ ] Tool definitions are `const` with `as const` for type inference

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/tools/community-schemas.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Import tools, verify schemas parse valid/invalid inputs correctly

**Dependencies:** Task 2 (server tool registry)

**Files likely touched:**
- `src/lib/mcp/tools/community.ts`
- `src/tests/mcp/tools/community-schemas.test.ts`

**Estimated scope:** M (2 files)

---

#### Task 6: Community Tool Handlers (Integration with LangChain Agent)
**Description:** Implement handlers for all 6 community tools, delegating to existing `createFinancialAgent` + PayPal SDK.

**Acceptance criteria:**
- [ ] `create_chama` handler calls agent with formatted prompt, returns community ID
- [ ] `join_chama` handler adds member, returns membership details
- [ ] `contribute` handler records contribution, triggers PayPal payment, returns payment ID
- [ ] `distribute_funds` handler triggers distribution, returns batch ID
- [ ] `get_community_state` handler queries DB via Drizzle, returns full state
- [ ] `analyze_trust` handler runs trust analysis, returns updated score
- [ ] All handlers return MCP `CallToolResult` format
- [ ] Errors from agent/PayPal wrapped in MCP error format

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/tools/community-handlers.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Call each tool via MCP endpoint with test data, verify DB state

**Dependencies:** Task 4, 5

**Files likely touched:**
- `src/lib/mcp/tools/community.ts` (add handlers)
- `src/tests/mcp/tools/community-handlers.test.ts`
- `src/tests/fixtures/test-agents.ts` (mock agent setup)

**Estimated scope:** M (3 files)

---

#### Task 7: Gig Tool Definitions & Handlers
**Description:** Define and implement 2 gig tools: `create_gig_job`, `complete_milestone`.

**Acceptance criteria:**
- [ ] `src/lib/mcp/tools/gig.ts` exports 2 tool definitions with Zod schemas
- [ ] `create_gig_job` handler creates gig with milestones via agent
- [ ] `complete_milestone` handler marks milestone, triggers payment if all done
- [ ] Both return MCP `CallToolResult` format
- [ ] Tools registered in MCP server

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/tools/gig.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Create gig, complete milestones, verify payments

**Dependencies:** Task 5, 6 (same pattern)

**Files likely touched:**
- `src/lib/mcp/tools/gig.ts`
- `src/tests/mcp/tools/gig.test.ts`

**Estimated scope:** S (2 files)

---

#### Task 8: Register All Tools in MCP Server
**Description:** Import and register all 8 tools in the MCP server initialization.

**Acceptance criteria:**
- [ ] `src/lib/mcp/tools/index.ts` exports `registerAllTools(server: MCPServer)`
- [ ] All 8 tools registered on server startup
- [ ] `tools/list` returns all 8 tools with correct schemas
- [ ] `tools/call` works for each tool

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/tools/registration.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: `tools/list` returns 8 tools, each callable

**Dependencies:** Task 5, 7

**Files likely touched:**
- `src/lib/mcp/tools/index.ts`
- `src/lib/mcp/server.ts` (initialization)
- `src/tests/mcp/tools/registration.test.ts`

**Estimated scope:** XS (1-2 files)

---

### Checkpoint: Core Tools
- [ ] All 8 tools registered and callable via MCP endpoint
- [ ] Each tool returns valid MCP response format
- [ ] Integration tests pass for all tools
- [ ] Review with human before proceeding

---

### Phase 3: SSE & Discovery

#### Task 9: SSE Endpoint for Streaming (GET /api/mcp/sse)
**Description:** Implement Server-Sent Events endpoint for long-running tool streaming (primarily `distribute_funds`).

**Acceptance criteria:**
- [ ] `src/app/api/mcp/sse/route.ts` handles GET with `session_id` query param
- [ ] Maintains connection, sends `data: {...}\n\n` events
- [ ] Sends periodic ping (every 30s) to keep alive
- [ ] Cleans up on client disconnect
- [ ] `distribute_funds` tool can optionally stream progress via SSE

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/sse.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Connect via curl/EventSource, verify events received

**Dependencies:** Task 2 (server core)

**Files likely touched:**
- `src/app/api/mcp/sse/route.ts`
- `src/lib/mcp/sse.ts`
- `src/tests/mcp/sse.test.ts`

**Estimated scope:** S (3 files)

---

#### Task 10: Discovery Manifest (/.well-known/agentic-commerce.json)
**Description:** Publish MCP server capabilities for PayPal Agent Toolkit and other agent discovery.

**Acceptance criteria:**
- [ ] `src/app/api/mcp/well-known/agentic-commerce/route.ts` serves manifest
- [ ] Manifest includes: protocol_version, merchant_id, endpoints, capabilities, categories, trust_signals
- [ ] Matches PayPal ACP manifest spec
- [ ] Cached with appropriate headers

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/discovery.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: `curl http://localhost:3000/.well-known/agentic-commerce.json` returns valid JSON

**Dependencies:** Task 8 (tools must be registered)

**Files likely touched:**
- `src/app/api/mcp/well-known/agentic-commerce/route.ts`
- `src/lib/mcp/discovery.ts`
- `src/tests/mcp/discovery.test.ts`

**Estimated scope:** S (2 files)

---

#### Task 11: AI Crawler Discovery (/api/mcp/llms.txt)
**Description:** Generate `llms.txt` for AI crawlers (Perplexity, ChatGPT, etc.) describing available tools.

**Acceptance criteria:**
- [ ] `src/app/api/mcp/llms.txt/route.ts` serves formatted text
- [ ] Lists all 8 tools with descriptions, parameters, example invocations
- [ ] Includes MCP endpoint URL and auth instructions
- [ ] Updated automatically when tools change

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/llms-txt.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: `curl http://localhost:3000/api/mcp/llms.txt` returns readable format

**Dependencies:** Task 8

**Files likely touched:**
- `src/app/api/mcp/llms.txt/route.ts`
- `src/lib/mcp/discovery.ts` (shared generation logic)
- `src/tests/mcp/llms-txt.test.ts`

**Estimated scope:** S (2 files)

---

### Checkpoint: Discovery & SSE
- [ ] SSE endpoint functional for streaming
- [ ] Discovery manifest accessible and valid
- [ ] llms.txt generated and readable
- [ ] All Phase 1-3 tests pass
- [ ] Review with human before proceeding

---

### Phase 4: Testing, Polish & Documentation

#### Task 12: End-to-End Integration Tests
**Description:** Full MCP flow tests: initialize → tools/list → tools/call (each tool) → verify DB state.

**Acceptance criteria:**
- [ ] `src/tests/mcp/integration.test.ts` covers all 8 tools
- [ ] Tests use test database (separate from dev/prod)
- [ ] Tests clean up after each case
- [ ] CI runs full suite on PR

**Verification:**
- [ ] Tests pass: `npm test -- src/tests/mcp/integration.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual: Run full test suite, verify coverage >80%

**Dependencies:** Task 8, 9, 10, 11

**Files likely touched:**
- `src/tests/mcp/integration.test.ts`
- `vitest.config.ts` (test DB setup)

**Estimated scope:** M (2 files)

---

#### Task 13: MCP Inspector Compatibility & Manual Verification
**Description:** Verify server works with official MCP Inspector CLI.

**Acceptance criteria:**
- [ ] `npx @modelcontextprotocol/inspector` connects to local server
- [ ] Can call all 8 tools via inspector UI
- [ ] Responses display correctly in inspector

**Verification:**
- [ ] Manual: Run inspector, test each tool
- [ ] Document any issues in `docs/mcp-inspector-notes.md`

**Dependencies:** Task 12

**Files likely touched:**
- `docs/mcp-inspector-notes.md`

**Estimated scope:** XS (1 file)

---

#### Task 14: Documentation & Usage Examples
**Description:** Document MCP server usage for external agent developers.

**Acceptance criteria:**
- [ ] `docs/mcp-server.md` with: quickstart, authentication, tool reference, examples
- [ ] Example: Create chama via MCP from Python/TypeScript
- [ ] Example: Join community, contribute, distribute
- [ ] Troubleshooting section (common errors, rate limits)

**Verification:**
- [ ] Manual: Follow quickstart, verify it works
- [ ] Review with human

**Dependencies:** Task 12

**Files likely touched:**
- `docs/mcp-server.md`

**Estimated scope:** S (1 file)

---

### Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] All tests pass (unit + integration)
- [ ] Build succeeds
- [ ] Documentation complete
- [ ] Ready for code review (`code-review-and-quality`)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| PayPal Agent Toolkit requires MCP extensions | High | Research PayPal's MCP spec early; keep tool definitions extensible |
| LangChain agent async complexity in handlers | Medium | Use existing agent patterns; add timeout wrapper |
| Rate limiting in-memory doesn't scale | Low | MVP only; document Redis upgrade path |
| Tool schema changes break external agents | High | Version tools in name (`create_chama_v1`); never mutate existing |
| SSE connection leaks | Medium | Strict cleanup on disconnect; max connections per key |

## Open Questions

1. **API Key storage:** Env allowlist for MVP (approved) — DB migration later?
2. **SSE scope:** Only `distribute_funds` for now — confirm?
3. **PayPal Agent Toolkit:** Need to verify their MCP requirements — research this week?
4. **Test DB:** Use separate PostgreSQL instance or SQLite for unit tests?
5. **Deployment:** Vercel supports SSE? Need separate worker for long-running?

---

**Plan complete.** Ready for human review before starting implementation (Phase 4: Implement).