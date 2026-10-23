# Task List: MCP Server for PayPal Agent Toolkit

## Phase 1: Foundation

- [x] **Task 1: MCP Protocol Types & JSON-RPC Handler**
  - Acceptance: Types defined, `handleMCPRequest` handles initialize/tools/list/tools/call with correct responses/errors
  - Verify: `npm test -- src/tests/mcp/protocol.test.ts`, `npm run build`
  - Dependencies: None
  - Files: `src/types/mcp.ts`, `src/lib/mcp/protocol.ts`, `src/tests/mcp/protocol.test.ts`
  - Scope: S

- [x] **Task 2: MCP Server Core & Method Routing**
  - Acceptance: `MCPServer` class registers tools, routes methods, validates params via Zod, wraps errors
  - Verify: `npm test -- src/tests/mcp/server.test.ts`, `npm run build`
  - Dependencies: Task 1
  - Files: `src/lib/mcp/server.ts`, `src/tests/mcp/server.test.ts`
  - Scope: S

- [x] **Task 3: API Key Authentication & Rate Limiting**
  - Acceptance: `validateAPIKey` from env JSON, `rateLimit` 100/min, proper HTTP codes (401/403/429)
  - Verify: `npm test -- src/tests/mcp/auth.test.ts`, `npm run build`
  - Dependencies: None (parallelizable)
  - Files: `src/lib/mcp/auth.ts`, `src/tests/mcp/auth.test.ts`
  - Scope: S

- [x] **Task 4: Main MCP HTTP Endpoint (POST /api/mcp)**
  - Acceptance: Next.js route integrates auth, rate limit, protocol handler; logs requests
  - Verify: `npm run build`
  - Dependencies: Task 1, 2, 3
  - Files: `src/app/api/mcp/route.ts`
  - Scope: S

## Checkpoint: Foundation
- [x] All foundation tests pass
- [x] Application builds without errors
- [x] `initialize` and `tools/list` work end-to-end via HTTP
- [x] Auth and rate limiting enforced
- [ ] Review with human before proceeding

## Phase 2: Core Tools

- [x] **Task 5: Community Tool Definitions & Schemas**
  - Acceptance: 6 tool definitions with Zod schemas matching SPEC, exported as `const`
  - Verify: `npm test -- src/tests/mcp/tools/community-schemas.test.ts`, `npm run build`
  - Dependencies: Task 2
  - Files: `src/lib/mcp/tools/community.ts`, `src/tests/mcp/tools/community-schemas.test.ts`
  - Scope: M

- [x] **Task 6: Community Tool Handlers (Integration with LangChain Agent)**
  - Acceptance: All 6 handlers delegate to `createFinancialAgent`, return MCP format, wrap errors
  - Verify: `npm test -- src/tests/mcp/tools/community-handlers.test.ts`, `npm run build`, manual MCP calls
  - Dependencies: Task 4, 5
  - Files: `src/lib/mcp/tools/community.ts`, `src/tests/mcp/tools/community-schemas.test.ts`
  - Scope: M

- [ ] **Task 7: Gig Tool Definitions & Handlers**
  - Acceptance: 2 tools (`create_gig_job`, `complete_milestone`) with schemas + handlers, registered
  - Verify: `npm test -- src/tests/mcp/tools/gig.test.ts`, `npm run build`, manual MCP calls
  - Dependencies: Task 5, 6
  - Files: `src/lib/mcp/tools/gig.ts`, `src/tests/mcp/tools/gig.test.ts`
  - Scope: S

- [ ] **Task 8: Register All Tools in MCP Server**
  - Acceptance: `registerAllTools(server)` registers 8 tools; `tools/list` returns all; each callable
  - Verify: `npm test -- src/tests/mcp/tools/registration.test.ts`, `npm run build`
  - Dependencies: Task 5, 7
  - Files: `src/lib/mcp/tools/index.ts`, `src/lib/mcp/server.ts`, `src/tests/mcp/tools/registration.test.ts`
  - Scope: XS

## Checkpoint: Core Tools
- [ ] All 8 tools registered and callable via MCP endpoint
- [ ] Each tool returns valid MCP response format
- [ ] Integration tests pass for all tools
- [ ] Review with human before proceeding

## Phase 3: SSE & Discovery

- [ ] **Task 9: SSE Endpoint for Streaming (GET /api/mcp/sse)**
  - Acceptance: SSE connection with session_id, pings, cleanup; `distribute_funds` can stream progress
  - Verify: `npm test -- src/tests/mcp/sse.test.ts`, `npm run build`, manual EventSource test
  - Dependencies: Task 2
  - Files: `src/app/api/mcp/sse/route.ts`, `src/lib/mcp/sse.ts`, `src/tests/mcp/sse.test.ts`
  - Scope: S

- [ ] **Task 10: Discovery Manifest (/.well-known/agentic-commerce.json)**
  - Acceptance: Manifest served with protocol_version, endpoints, capabilities, categories, trust_signals
  - Verify: `npm test -- src/tests/mcp/discovery.test.ts`, `npm run build`, manual curl
  - Dependencies: Task 8
  - Files: `src/app/api/mcp/well-known/agentic-commerce/route.ts`, `src/lib/mcp/discovery.ts`, `src/tests/mcp/discovery.test.ts`
  - Scope: S

- [ ] **Task 11: AI Crawler Discovery (/api/mcp/llms.txt)**
  - Acceptance: llms.txt served with all 8 tools, descriptions, params, examples, auth instructions
  - Verify: `npm test -- src/tests/mcp/llms-txt.test.ts`, `npm run build`, manual curl
  - Dependencies: Task 8
  - Files: `src/app/api/mcp/llms.txt/route.ts`, `src/lib/mcp/discovery.ts`, `src/tests/mcp/llms-txt.test.ts`
  - Scope: S

## Checkpoint: Discovery & SSE
- [ ] SSE endpoint functional for streaming
- [ ] Discovery manifest accessible and valid
- [ ] llms.txt generated and readable
- [ ] All Phase 1-3 tests pass
- [ ] Review with human before proceeding

## Phase 4: Testing, Polish & Documentation

- [ ] **Task 12: End-to-End Integration Tests**
  - Acceptance: Full flow tests for all 8 tools with test DB, cleanup, CI integration
  - Verify: `npm test -- src/tests/mcp/integration.test.ts`, `npm run build`, coverage >80%
  - Dependencies: Task 8, 9, 10, 11
  - Files: `src/tests/mcp/integration.test.ts`, `vitest.config.ts`
  - Scope: M

- [ ] **Task 13: MCP Inspector Compatibility & Manual Verification**
  - Acceptance: `@modelcontextprotocol/inspector` connects, all tools callable, responses display
  - Verify: Manual inspector test, document in `docs/mcp-inspector-notes.md`
  - Dependencies: Task 12
  - Files: `docs/mcp-inspector-notes.md`
  - Scope: XS

- [ ] **Task 14: Documentation & Usage Examples**
  - Acceptance: `docs/mcp-server.md` with quickstart, auth, tool reference, examples, troubleshooting
  - Verify: Manual quickstart follow-through, human review
  - Dependencies: Task 12
  - Files: `docs/mcp-server.md`
  - Scope: S

## Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] All tests pass (unit + integration)
- [ ] Build succeeds
- [ ] Documentation complete
- [ ] Ready for code review (`code-review-and-quality`)