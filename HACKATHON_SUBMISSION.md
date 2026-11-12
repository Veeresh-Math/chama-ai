# Hackathon Submission Checklist — PayPal AI Hackathon 2026

**Deadline:** Nov 13, 2026, 1:30am GMT+5:30  
**Category:** Best Use of PayPal + AI ($5,000)  
**Project:** Cham.ai — AI-Powered Wealth Collective

---

## 1. Pre-Submission Checklist

### Code & Repository
- [ ] Code pushed to GitHub (public repo: Veeresh-Math/chama-ai)
- [ ] LICENSE file added (MIT)
- [ ] README updated with hackathon details
- [ ] .env.local has all required keys (**NOT committed to repo**)

### Demo & Deployment
- [ ] Demo video recorded (< 3 min)
- [ ] Demo video uploaded (YouTube/Loom)
- [ ] Vercel deployment successful
- [ ] Live URL tested end-to-end
- [ ] PayPal sandbox verified in Streamlit sidebar

### Submission
- [ ] Hackathon submission form completed

---

## 2. Required Submission Fields

| Field | Value |
|-------|-------|
| **Project Name** | Cham.ai |
| **Category** | Best Use of PayPal + AI |
| **Description** | AI-powered wealth collective platform enabling community savings circles, investment pools, and gig escrow with PayPal Payouts and PYUSD stablecoin integration |
| **GitHub Repo URL** | https://github.com/Veeresh-Math/chama-ai |
| **Demo Video URL** | *(fill after upload)* |
| **Live Deployment URL** | *(fill after Vercel deploy)* |

---

## 3. PayPal Integration Points to Highlight

- **PayPal REST SDK** — Sandbox mode for development & testing
- **Payouts API** — Automated collective distributions to circle members
- **PYUSD Stablecoin Support** — Settlement on Arbitrum/Solana via PayPal's stablecoin
- **Webhook Handling** — Verified signatures for payment confirmations, payout status, disputes
- **AI Agent with PayPal Tools** — LangChain agent calling PayPal functions (create payout, check balance, verify webhook)

---

## 4. AI Integration Points

- **LangChain Agent** — OpenAI GPT-4o powered financial copilot
- **Multi-Agent Council** — Trust Scorer, Compliance Officer, Treasury Manager agents
- **Tool Calling for Financial Ops** — PayPal payouts, PYUSD transfers, escrow release, circle analytics
- **Consensus-Based Decisions** — 3-agent voting before executing financial transactions
- **Agentic Commerce Protocol (ACP)** — /agent endpoints for external AI agent discovery

---

## 5. Quick Links (Fill After Deployment)

| Link | URL |
|------|-----|
| **GitHub Repo** | https://github.com/Veeresh-Math/chama-ai |
| **Live URL** | |
| **Demo Video** | |
| **YouTube/Loom Link** | |

---

## Notes

- Keep .env.local local — never commit API keys, PayPal secrets, or private keys
- Test PayPal sandbox flow: create circle → contribute → trigger distribution → verify payout
- Demo video should show: circle creation, AI copilot chat, PayPal payout execution, PYUSD settlement
- Vercel env vars must mirror .env.local for production

---

*Generated for PayPal AI Hackathon 2026 submission*
