# PRODUCT.md — Cham.ai

## What we build
Cham.ai is an AI-powered wealth collective for community savings circles (chamas/tontines), investment pools, and gig-worker milestone escrow. Users pool money, make collective decisions via an AI financial copilot, and settle instantly with PayPal / PYUSD on Arbitrum/Solana.

## Who it's for
- Community savings-circle organizers and members
- Gig workers needing milestone escrow
- Platforms/co-ops embedding Cham.ai via MCP + ACP

## Core user journeys
1. **Open a circle** — name it, set contribution amount/cadence, invite members by link (shared ledger from minute one).
2. **Contribute** — PayPal Checkout with webhook confirmation; no spreadsheet reconciliation.
3. **Decide + distribute** — agent proposes the split, human approves once, Payouts settles everyone with receipts.
4. **Gig escrow** — funds locked per milestone, released on approval.
5. **Agentic commerce** — MCP server + ACP discovery manifest expose financial tools to AI assistants (API-key auth, rate limits).

## Constraints
- Real money (PayPal, PYUSD) → idempotency, webhook signature validation, parameterized Drizzle queries, no secrets in code.
- Accessibility-first: semantic HTML, aria-labels on icon buttons, focus-visible rings, prefers-reduced-motion honored.
- Next.js 14 App Router, Tailwind, shadcn/ui, Framer Motion + GSAP, Drizzle ORM (PostgreSQL/Neon).

## Success metrics
- Contribution cycle completion rate
- Payout settlement success rate (PayPal/PYUSD)
- MCP/ACP tool call volume
- Accessibility audit score (P0 blockers = 0)

## Non-goals (v1)
- Crypto on/off-ramp beyond PYUSD settlement
- Mobile native apps (responsive web only)
- Fiat bank ACH (PayPal only)
