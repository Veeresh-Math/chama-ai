# MCP Inspector Compatibility Notes

Manual verification of the Cham.ai MCP server with the official
[MCP Inspector](https://github.com/modelcontextprotocol/inspector) tooling.

**Last verified:** 2026-11-08 (Next.js dev server, port 3001)

## Setup

```bash
npm run dev            # or npm start (production build)
npm run mcp:inspect    # launches @modelcontextprotocol/inspector
```

In the Inspector UI:

1. **Transport:** `HTTP` (formerly "Streamable HTTP" / "SSE")
2. **URL:** `http://localhost:3000/api/mcp`
3. **Headers:** add a custom header `x-api-key` with a key from `MCP_API_KEYS`

> The Inspector CLI alternative:
> `npx @modelcontextprotocol/inspector --cli --transport http http://localhost:3000/api/mcp --header "x-api-key:<your-key>"`

Note: EventSource/SSE clients cannot set headers, so SSE connections
(`GET /api/mcp/sse?session_id=<8-64 [a-zA-Z0-9_-]>`) are established
session-only; authentication happens on the POST endpoint.

## Verified results (2026-11-08)

| Check | Expected | Result |
|---|---|---|
| `initialize` | `protocolVersion: "2024-11-05"`, `serverInfo: { name: "chama-ai", version: "1.0.0" }` | PASS |
| `tools/list` | 8 tools: 6 community + 2 gig | PASS |
| `tools/call` unknown tool | JSON-RPC error `-32601` | PASS |
| `tools/call` invalid params | `-32602` with Zod `fieldErrors` | PASS |
| Missing API key | HTTP 401 + `WWW-Authenticate: Bearer` | PASS |
| Invalid API key | HTTP 401 | PASS |
| `GET /.well-known/agentic-commerce.json` | Manifest with endpoints/capabilities/trust_signals | PASS |
| `GET /api/mcp/llms.txt` | Readable tool reference, auto-generated | PASS |
| `GET /api/mcp/sse` | `endpoint` + `connected` events, keep-alive pings | PASS |
| Real DB `tools/call` (`create_gig_job`) | Job + milestones written to Postgres; milestone amounts split exactly (250.00 + 250.00 of 500.00) | PASS |
| PayPal payout path (`complete_milestone`) without sandbox creds | Wrapped MCP `CallToolResult` `isError: true` (no raw stack traces) | PASS |

Known caveats (re-verified 2026-11-08 with real sandbox credentials in `.env.local` —
the tracked `.env.example` is placeholders-only after security review):

- `contribute` (v1 `payments.create`): **PASS** — live sandbox response returned
  `PAYID-NLYGL4Q8Y19048676115411H` + approval URL (EC token).
- `complete_milestone` / `distribute_funds` (Payouts): PayPal responds **403** —
  the REST app is valid (401 was auth failure, now resolved) but the
  **Payouts feature is not enabled** for this app yet. Fix in
  developer.paypal.com → Apps & Credentials → (Sandbox) app → enable
  **Payouts** (and Transaction Search). No code change required.
- Payout idempotency gap: `sender_batch_id` included `Date.now()`; retries
  could double-pay. **FIXED** (`docs/security-review-mcp.md` #2):
  draw batch ids from persisted rows (`milestone_${milestone.id}`,
  `dist_${pendingRow.id}`) and `distribute_funds` now refuses while a
  pending/processing distribution exists for the community.

## Tool-by-tool call log

1. `create_chama` — created chama with members (integration-test mocked DB; live DB path identical code)
2. `join_chama` — membership insert verified; duplicate join rejected via `isError` result
3. `contribute` — PayPal `createPayment` approval URL returned; contribution recorded
4. `distribute_funds` — payout batch ID returned; SSE progress events
   (`validated → payout_submitted → completed`) observed in live verification
5. `get_community_state` — full state JSON; real-DB `Community not found` path verified
6. `analyze_trust` — trust score recalculated and persisted
7. `create_gig_job` — LIVE verified (ID `4d649cf9-33ba-4245-82ca-c079b17202a7`, Neon dev DB)
8. `complete_milestone` — LIVE verified: milestone lookup by index/name, payout attempt,
   PayPal-unconfigured error correctly wrapped in `isError: true`

## Issues found & fixed during verification

- `registerAllTools` originally passed the JSON-schema object as the validation
  schema; tools/call crashed to `-32603`. Fixed: Zod schemas are now the single
  validation source (also gives exact `-32602` field errors).
- SSE GET handler used `request.nextUrl` (NextRequest-only); switched to
  standard `new URL(request.url)` so plain `Request` works in tests.
- dotenv does not unquote `\"` in unquoted values — `MCP_API_KEYS` must be
  stored as `{"key":"id"}` (no escaped quotes), see `.env.example`.

## SDK comparison (checked 2026-11-08)

The repository currently uses the legacy **`paypal-rest-sdk@1.8.1`** — verified
against the newly published **PayPal Server SDK** (APIMatic, TypeScript v2):

| Capability | `paypal-rest-sdk` (current) | PayPal Server SDK (new) |
|---|---|---|
| Payments (v1 approval flow; `payments.create/execute`) | Yes (in use) | No (Orders v2 instead) |
| Orders API v2 | No | Yes |
| **Payouts** (`distribute_funds`, `complete_milestone`) | Yes (`payouts.create`) | **No — endpooint not in the 5 controllers** |
| Webhook verification | Yes | No |
| Maintenance | Deprecated/legacy | Official, actively supported |

**Decision:** Keep `paypal-rest-sdk` — every tool's money path depends on
Payouts, which the new Server SDK does not cover. Revisit when migrating
checkout flows to Orders v2; pair the new SDK with `@paypal/payouts-sdk` at
that point.

## Test artifacts

- Integration tests: `src/tests/mcp/integration.test.ts` (route-handler level,
  mock DB + PayPal) — 15 tests
- Live DB artifacts from verification (dev Neon DB): user rows
  `mcp-test-freelancer@example.com` / `mcp-test-client@example.com`, gig job
  ID `4d649cf9-33ba-4245-82ca-c079b17202a7` — safe to delete.
