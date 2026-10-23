# AGENTS.md — Cham.ai (chama-ai)

This file configures AI coding agents (opencode, Claude Code, etc.) for building **Cham.ai** — an AI-powered wealth collective platform for community savings circles, investment pools, and gig escrow with PayPal/PYUSD integration.

## Project Overview

**Cham.ai** is a Next.js 14 + TypeScript platform enabling communities to pool resources, make collective investment decisions, and grow wealth together using AI-powered insights.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM (PostgreSQL), PayPal REST SDK, LangChain/OpenAI, PYUSD (stablecoin), Framer Motion, GSAP

**Key Features:**
- Community savings circles (chamas/tontines) with trust scoring
- Automated distributions via PayPal Payouts / PYUSD on Arbitrum/Solana
- AI Financial Copilot (LangChain agent with PayPal tools)
- Gig worker milestone escrow
- Agentic Commerce Protocol (ACP) endpoints for AI agent discovery
- Model Context Protocol (MCP) server for external agent access

## OpenCode Skill-Driven Execution

OpenCode uses a **skill-driven execution model** powered by the `skill` tool and the `.agent-skills/skills/` directory.

### Core Rules

- If a task matches a skill, you MUST invoke it
- Skills are located in `.agent-skills/skills/<skill-name>/SKILL.md`
- Never implement directly if a skill applies
- Always follow the skill instructions exactly (do not partially apply them)

### Intent → Skill Mapping

| User Intent | Required Skills (in order) |
|-------------|---------------------------|
| New feature / functionality | `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` → `test-driven-development` |
| Planning / breakdown | `planning-and-task-breakdown` |
| Bug / failure / unexpected behavior | `debugging-and-error-recovery` |
| Code review / PR review | `code-review-and-quality` |
| Refactoring / simplification | `code-simplification` |
| API / interface design | `api-and-interface-design` |
| UI / frontend work | `frontend-ui-engineering` |
| Security concerns | `security-and-hardening` |
| Performance issues | `performance-optimization` |
| CI/CD / automation | `ci-cd-and-automation` |
| Documentation / ADRs | `documentation-and-adrs` |
| Requirements clarification | `interview-me` |
| Idea refinement | `idea-refine` |
| Deprecation / migration | `deprecation-and-migration` |
| Observability / logging | `observability-and-instrumentation` |
| Constraint-driven work | `constraint-driven-development` |
| Context engineering | `context-engineering` |
| Browser testing | `browser-testing-with-devtools` |
| Git workflow | `git-workflow-and-versioning` |

### Lifecycle Mapping (Implicit Commands)

OpenCode does not support slash commands like `/spec` or `/plan`. Instead, the agent must internally follow this lifecycle:

- **DEFINE** → `spec-driven-development`
- **PLAN** → `planning-and-task-breakdown`
- **BUILD** → `incremental-implementation` + `test-driven-development`
- **VERIFY** → `debugging-and-error-recovery`
- **REVIEW** → `code-review-and-quality`
- **SHIP** → `shipping-and-launch`

### Execution Model

For every request:

1. Determine if any skill applies (even 1% chance)
2. Invoke the appropriate skill using the `skill` tool
3. Follow the skill workflow strictly
4. Only proceed to implementation after required steps (spec, plan, etc.) are complete

### Anti-Rationalization

The following thoughts are incorrect and must be ignored:
- "This is too small for a skill"
- "I can just quickly implement this"
- "I'll gather context first"

Correct behavior: **Always check for and use skills first**

## Human Review Integration

For UI/UX work, landing pages, and visual review, use the **human-review** skill from `.human-review/`:

```bash
# Review a local file
/human-review src/app/page.tsx

# Review a running localhost page
/human-review http://localhost:3001
```

This opens a visual editor (like Google Docs) where you can:
- Edit text directly, tweak formatting
- Leave anchored comments on specific text/elements
- Drag to rearrange blocks, resize images
- Send all edits + comments to the agent at once
- Agent applies changes and refreshes for next review round

Use this for:
- Landing page iterations (`src/app/page.tsx`)
- Dashboard UI components
- Email templates
- Markdown documentation

## Project-Specific Skill Priorities

### High Priority (Always Use)
1. **`spec-driven-development`** — Write specs before any implementation (critical for PayPal/PYUSD integrations)
2. **`test-driven-development`** — Red-green-refactor for all financial code
3. **`security-and-hardening`** — OWASP assessment for payment flows
4. **`code-review-and-quality`** — Five-axis review before merge

### Medium Priority (Use When Applicable)
5. **`api-and-interface-design`** — For ACP/MCP endpoints, PayPal webhooks
5. **`frontend-ui-engineering`** — For shadcn/ui components, GSAP animations
6. **`planning-and-task-breakdown`** — For multi-step features
7. **`incremental-implementation`** — For complex features (PYUSD settlement, A2A flows)
8. **`debugging-and-error-recovery`** — For webhook failures, payment issues
9. **`documentation-and-adrs`** — For architecture decisions (e.g., chain selection)

### Specialized (Use When Needed)
10. **`interview-me`** — When requirements are ambiguous
11. **`idea-refine`** — For new feature ideation
12. **`observability-and-instrumentation`** — For payment monitoring
13. **`performance-optimization`** — For GSAP animations, bundle size
14. **`ci-cd-and-automation`** — For Vercel deployment, GitHub Actions
15. **`shipping-and-launch`** — For production releases

## Financial Code Guardrails

When working on ANY payment/financial code (PayPal, PYUSD, distributions, escrow):

1. **ALWAYS** run `security-and-hardening` skill first
2. **ALWAYS** write tests via `test-driven-development` before implementation
3. **ALWAYS** get `code-review-and-quality` review before merge
4. **NEVER** commit secrets (API keys, private keys) — use `.env.local`
5. **ALWAYS** use Drizzle ORM with parameterized queries (no raw SQL)
6. **ALWAYS** validate webhook signatures (PayPal, ACP)
7. **ALWAYS** implement idempotency for payment operations

## Agent Personas Available

From `.agent-skills/agents/`:
- `code-reviewer` — Senior Staff Engineer, five-axis review
- `security-auditor` — Security Engineer, OWASP assessment
- `test-engineer` — QA Specialist, test strategy & Prove-It pattern
- `api-designer` — API design specialist
- `frontend-engineer` — UI/UX specialist

Invoke via skill tool when task matches.

## References

- Agent Skills: `.agent-skills/` (25 skills)
- Human Review: `.human-review/` (visual editor)
- Skills CLI: `npx skills add addyosmani/agent-skills`
- Human Review CLI: `npx -y human-review setup --global`

---

**Remember:** This project handles real money (PayPal, PYUSD). Every line of financial code must go through the full skill lifecycle: SPEC → PLAN → TEST → BUILD → REVIEW → SHIP. No exceptions.