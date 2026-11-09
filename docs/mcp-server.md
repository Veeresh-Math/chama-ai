# Cham.ai MCP Server

The Cham.ai MCP server exposes 8 financial tools to **external AI agents**
(ChatGPT, Perplexity, custom agents, PayPal's agent toolkit) via
[Model Context Protocol](https://modelcontextprotocol.io) — JSON-RPC 2.0 over
HTTP, with optional SSE streaming for long-running operations.

Endpoints:

| Endpoint | Purpose |
|---|---|
| `POST /api/mcp` | Main MCP endpoint (`initialize`, `tools/list`, `tools/call`) |
| `GET /api/mcp/sse?session_id=<id>` | SSE stream; progress events for long tools |
| `GET /.well-known/agentic-commerce.json` | Discovery manifest (Agentic Commerce Protocol) |
| `GET /api/mcp/llms.txt` | AI-crawler friendly tool reference (auto-generated) |

## Quickstart

```bash
# 1. Configure a dev key (JSON object: key -> userId)
MCP_API_KEYS={"mcp_dev_key_7f3a":"dev-user"}

# 2. Run the app
npm run dev

# 3. Initialize
curl -X POST http://localhost:3000/api/mcp \
  -H "content-type: application/json" \
  -H "x-api-key: mcp_dev_key_7f3a" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}'
```

## Authentication

Every POST requires an `x-api-key` header. Keys are loaded from the
`MCP_API_KEYS` env variable (JSON mapping key → user id).

- Missing key → **401** with `WWW-Authenticate: Bearer`
- Invalid key → **401**
- Rate limit exceeded (>100 req/min per key) → **429** with `Retry-After`

No key should ever be committed; use `.env.local` (local) or platform env vars
(Vercel).

## Tool Reference

### Community (savings circles)

| Tool | Args (required in bold) | Returns |
|---|---|---|
| `create_chama` | **name, owner_email, monthly_contribution, member_emails** [1–50]; currency (USD/KES/NGN/PYUSD, default USD), auto_distribute | Community ID + member count |
| `join_chama` | **community_id, user_email**; share_percentage | Membership + share % |
| `contribute` | **community_id, member_email, amount**; currency | PayPal payment ID + approval URL |
| `distribute_funds` | **community_id**; triggered_by (manual/auto/agent), session_id (SSE progress) | Payout batch ID |
| `get_community_state` | **community_id** | Full JSON state: members, contributions, distributions, summary |
| `analyze_trust` | **community_id** | Recalculated trust score (0–100) with factors |

### Gig escrow

| Tool | Args (required in bold) | Returns |
|---|---|---|
| `create_gig_job` | **title, freelancer_email, client_email, total_budget, milestones** [1–20, percentages must sum to 100]; client_name, currency | Job ID + per-milestone amounts (last milestone absorbs rounding cents) |
| `complete_milestone` | **job_id** + (milestone_index (1-based) or milestone_name) | Milestone completion + PayPal payout batch ID; job auto-completes when all milestones are done |

All tool args are validated with Zod schemas before any DB or PayPal call —
invalid input returns JSON-RPC **-32602** with per-field errors.

## Example: create a savings circle (TypeScript)

```ts
const res = await fetch('http://localhost:3000/api/mcp', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-api-key': process.env.CHAM_API_KEY! },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'create_chama',
      arguments: {
        name: 'Nairobi Savers',
        owner_email: 'owner@example.com',
        monthly_contribution: 50,
        member_emails: ['a@example.com', 'b@example.com'],
        auto_distribute: false,
      },
    },
  }),
});
const rpc = await res.json();
console.log(rpc.result.content[0].text);
```

## Example: gig escrow + milestone release (Python)

```python
import requests

BASE = "http://localhost:3000/api/mcp"
HEADERS = {"x-api-key": "mcp_dev_key_7f3a", "content-type": "application/json"}

def call(name, **arguments):
    return requests.post(BASE, headers=HEADERS, json={
        "jsonrpc": "2.0", "id": 42, "method": "tools/call",
        "params": {"name": name, "arguments": arguments},
    }).json()["result"]["content"][0]["text"]

print(call("create_gig_job",
    title="Build landing page",
    freelancer_email="dev@example.com",
    client_email="client@example.com",
    total_budget=1000,
    milestones=[
        {"name": "Design", "percentage": 40},
        {"name": "Development", "percentage": 60},
    ],
))

print(call("complete_milestone",
    job_id="4d649cf9-33ba-4245-82ca-c079b17202a7",
    milestone_index=1,          # Design milestone released first (40%)
))
```

## Streaming progress (SSE)

`distribute_funds` streams progress when you pass a `session_id`:

```text
1. Open:   GET /api/mcp/sse?session_id=my-dist-session
2. Observe: event: endpoint  →  POST URL
            event: connected →  protocol_version
3. Call:    tools/call distribute_funds { community_id, session_id: "my-dist-session" }
4. Observe: event: progress  → { step: "validated" | "payout_submitted" | "completed",
                                 message, progress (0-100), timestamp }
```

Keep-alive `ping` events arrive every 30s; sessions are cleaned up on client
disconnect and after 5 minutes of staleness.

## Observability

Every request is logged server-side:

```
[MCP] tools/call 13 - 15ms - ok
[MCP SSE] Session connected: <session_id>
```

Errors are logged with stack traces server-side; clients only ever receive
wrapped MCP errors (`-32603` / `isError` results) — raw exception details are
never exposed.

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| 401 on every request | Missing/invalid `x-api-key`; confirm key exists in `MCP_API_KEYS` |
| 429 | Over 100 req/min; honor `Retry-After` header |
| -32601 | Unknown tool name or method — check `tools/list` |
| -32602 | Invalid arguments; response `data.fieldErrors` lists each field |
| -32700 | Malformed JSON body |
| PayPal `Response Status : 401` inside `isError` result | Sandbox credentials not configured (`PAYPAL_CLIENT_ID/SECRET` placeholders) |
| SSE 400 | `session_id` must be 8–64 chars of `[a-zA-Z0-9_-]` |
| dotenv rejects `MCP_API_KEYS` JSON | Store unquoted JSON: `{"key":"val"}` — no escaped quotes |

## Testing

```bash
npm run test:mcp      # 139 tests: protocol, auth, tools, SSE, discovery, integration
npm run build         # production build
npm run mcp:inspect   # interactive Inspector UI
```

See `docs/mcp-inspector-notes.md` for the verified compatibility checklist.
