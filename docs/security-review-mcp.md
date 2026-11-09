# Security Review — MCP Server Surface (2026-11-08)

Scope: `POST /api/mcp`, `GET /api/mcp/sse`, discovery endpoints (`/.well-known/agentic-commerce.json`, `/api/mcp/llms.txt`), tool handlers (`src/lib/mcp/tools/*`), auth module (`src/lib/mcp/auth.ts`), PayPal integration (`src/lib/paypal.ts` via legacy `paypal-rest-sdk`).

## Findings summary

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | Real PayPal client ID/secret staged in tracked `.env.example` | CRITICAL (leak risk) | FIXED — sanitized; secret existed only in staged blob, never committed/pushed |
| 2 | Payout double-pay window — `sender_batch_id` includes `Date.now()` | HIGH | FIXED — deterministic batch ids + pending-row conflict guard |
| 3 | SSE connection-exhaustion DoS (unauthenticated) | HIGH | FIXED — hard caps (100 total / 10 per IP), stale sweep, 429 responses |
| 4 | SSE duplicate session-id hijack | MEDIUM | FIXED — duplicate `session_id` registration rejected |
| 5 | `X-RateLimit-Remaining` computed from nonexistent `'default'` key | MEDIUM | FIXED — header now reflects the caller's actual usage |
| 6 | Missing vs invalid API key not distinguished (SPEC conformance) | LOW | FIXED — 401 + `WWW-Authenticate` challenge for missing; 403 for invalid |
| 7 | Webhook signature verification depends on placeholder `PAYPAL_WEBHOOK_ID` | MEDIUM | OPEN — set real webhook ID before accepting any webhook callbacks |
| 8 | In-memory rate limiting & SSE caps don't scale across instances | LOW | OPEN — documented Redis upgrade path |
| 9 | Integration tests mocked DB/PayPal (no dedicated test branch) | LOW | OPEN — use a Neon test branch per-PR before launch |

## Details and remediations

### 1. Secret in `.env.example` (CRITICAL → FIXED)

The real PayPal sandbox client ID/secret were pasted into the tracked
`.env.example` while the file was staged for commit. Verified via
`git log --all` that the secret never entered any commit object.
Remediation: placeholders restored, comment added pointing to `.env.local`
(gitignored — verified via `git check-ignore`). **Precautionary:** rotate the
sandbox client secret in the PayPal developer dashboard regardless, since the
credential has been exposed outside the repository (screenshots, chat).

### 2. Payout double-pay window (HIGH → FIXED)

`createSplitPayment` callers used to derive `sender_batch_id` with
`Date.now()`, so a client retry after a network timeout had a
**new batch** created → risk of double payout. PayPal rejects duplicate
batch ids within 30 days, which is the idempotency hook the timestamp
defeated. Implemented in `src/lib/mcp/tools/community.ts` +
`src/lib/mcp/tools/gig.ts`:

- `handleDistributeFunds`: a `distributions` row is inserted with
  `status='pending'` **before** the PayPal call, and any existing
  `pending`/`processing` row for the community blocks the tool call
  ("Distribution already in progress"). The batch id is the persisted row
  id (`dist_${pendingRow.id}`) — deterministic across retries of the same
  payout. On PayPal success the row is updated to `completed` with
  `paypalPayoutBatchId` + `completedAt`; on PayPal failure the row is set
  to `failed` so a retry is permitted.
- `complete_milestone`: `sender_batch_id` is now `milestone_${milestone.id}`
  (no timestamp). Completing an already-paid milestone is blocked by the
  `isCompleted` check; PayPal's 30-day duplicate-batch-id rejection is the
  final backstop.

Covered by `src/tests/mcp/integration.test.ts` ("distribute_funds blocks
retry while a payout is still pending").

### 3. SSE DoS protection (FIXED)

`GET /api/mcp/sse` is intentionally public (EventSource/SSE clients cannot
send headers). Protections now in `src/lib/mcp/sse.ts` + route:

- Global concurrent-session cap: **100**
- Per-IP concurrent cap: **10** (resolves `x-forwarded-for` → `x-real-ip` → `unknown`)
- Stale-session sweep (>5 min) on every connect attempt
- Rejected connections receive **429** + `Retry-After: 30`
- Duplicate `session_id` cannot replace an existing stream (session-hijack
  resistance); the rejected request is disposed immediately

### 5. Rate-limit headers (FIXED)

`getRateLimitHeaders(key, …)` now reports the caller's real usage
(`X-RateLimit-Limit`/`X-RateLimit-Remaining`/`Retry-After`).

### 6. Auth semantics (FIXED)

- Missing `x-api-key` → **401**, `WWW-Authenticate: Bearer error="missing_token"`
- Invalid key → **403**, `WWW-Authenticate: Bearer error="invalid_token"`
- Rate limiting applies only to authenticated keys (100 req/min)

### Input validation

- Tool arguments validated with Zod before any DB or PayPal call
  (`-32602` + per-field errors) — schema definitions single-source in
  `communityToolSchemas` / `gigToolSchemas`
- Errors are wrapped: clients receive MCP results (`isError`) or JSON-RPC
  errors only; raw stack traces stay server-side
- All DB access via Drizzle with parameterized queries (no raw SQL)

### Error/info disclosure

- `dangerouslySetInnerHTML` not present in MCP paths
- `session_id`, payout batch IDs and community IDs are the only opaque
  identifiers exposed; SSE progress streams share no financial detail
  beyond the caller's own operation

## Residual risks & next steps

1. ~~Implement payout idempotency (finding #2)~~ **DONE** — still enable the
   Payouts feature on the PayPal sandbox app before live payout testing.
2. Set real `PAYPAL_WEBHOOK_ID` and exercise `verifyWebhookSignature` end-to-end.
3. Move rate-limit + SSE stores to Redis (Upstash already in stack) for
   multi-instance correctness.
4. API key hygiene: keys are 24+ chars, stored as JSON in env; add rotation
   procedure in `docs/mcp-server.md` (issue new key → update env → revoke old).
5. Prefer OAuth-protected resources for MCP once auth surface shipped
   (Better Auth managed OAuth server can guard MCP per Neon docs).

Verified: 146/146 MCP tests pass (incl. new cap/DoS/auth-status tests);
production build green.
