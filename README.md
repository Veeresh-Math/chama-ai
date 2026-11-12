# Cham.ai

<div align="center">
  <h1>AI-Powered Wealth Collective</h1>
  <p>Transform communities into thriving wealth ecosystems where members save, invest, and grow together</p>
  
  <br/>
  
  <a href="https://github.com/Veeresh-Math/chama-ai">
    <img src="https://img.shields.io/github/stars/Veeresh-Math/chama-ai?style=for-the-badge&logo=github&logoColor=white&color=ff0066" alt="GitHub stars">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/issues">
    <img src="https://img.shields.io/github/issues/Veeresh-Math/chama-ai?style=for-the-badge&logo=github&logoColor=white&color=ffd43b" alt="GitHub issues">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Veeresh-Math/chama-ai?style=for-the-badge&logo=github&logoColor=white&color=00d099" alt="GitHub contributors">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Veeresh-Math/chama-ai?style=for-the-badge&logo=github&logoColor=white&color=6366f1" alt="License: MIT">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/commits/main">
    <img src="https://img.shields.io/github/last-commit/Veeresh-Math/chama-ai?style=for-the-badge&logo=github&logoColor=white&color=f472b6" alt="Last commit">
  </a>
</div>

**Cham.ai | PayPal AI Hackathon 2026 Winner**

---

## Table of Contents

1. [What is Cham.ai?](#what-is-cham-ai)
2. [PayPal AI Hackathon 2026 Submission](#paypal-ai-hackathon-2026-submission)
3. [Key Features](#key-features)
4. [Architecture](#architecture)
5. [Quick Start](#quick-start)
6. [Environment Variables](#environment-variables)
7. [Demo Walkthrough](#demo-walkthrough)
8. [License](#license)

---

## What is Cham.ai?

Cham.ai revolutionizes traditional community savings circles (chamas) for the digital age by enabling **community savings circles, investment pools, and gig worker escrow** with PayPal/PYUSD integration. Our platform combines AI-powered insights with blockchain-stablecoin infrastructure to help communities grow wealth collectively while maintaining trust and transparency through a multi-agent governance council.

---

## PayPal AI Hackathon 2026 Submission

### Category: Best Use of PayPal + AI

This submission demonstrates the perfect synergy between PayPal's global payment infrastructure and advanced AI capabilities to create a revolutionary wealth-building platform for underserved communities. Cham.ai leverages PayPal's sandbox integration, AI agentic governance, and PYUSD stablecoin to deliver a secure, transparent, and scalable solution for community finance.

### Key Hackathon Features

- **PayPal Sandbox Integration**: Complete payment processing with PayPal's REST SDK, including payouts, refunds, and webhook handling
- **LangChain AI Agent**: Intelligent financial copilot for investment recommendations and risk analysis
- **Agent Council**: Multi-agent consensus system with Trust, Compliance, and Treasury agents
- **PYUSD Stablecoin Support**: USD-pegged stablecoin for fast, low-cost cross-border transactions

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **LangChain/OpenAI** | AI agent development |
| **PayPal REST SDK** | Payment processing |
| **PYUSD** | Stablecoin integration |

---

## Key Features

### Community Savings Circles (chamas/tontines)
Create and manage trust-based savings pools where members contribute regularly and receive automated distributions based on predefined rules and AI-optimized timing.

### AI Financial Copilot (LangChain agent)
Get intelligent investment recommendations, risk analysis, and financial planning powered by OpenAI models integrated with LangChain.

### Agent Council (multi-agent consensus)
Three specialized agents work together:
- **Trust Agent**: Evaluates member trustworthiness through behavioral analysis
- **Compliance Agent**: Ensures regulatory adherence and transaction validation
- **Treasury Agent**: Manages asset allocation and investment strategies

### PayPal Payouts Integration
Seamless money movement with PayPal's global payment network, supporting instant transfers, recurring payments, and batch payouts.

### Gig Worker Milestone Escrow
Secure escrow services for gig workers where payments are released upon milestone completion, with AI-powered dispute resolution.

### ACP Endpoints for AI Agent Discovery
Standardized Agentic Commerce Protocol endpoints enabling external AI agents to discover and integrate with our platform.

### MCP Server for External Agent Access
Model Context Protocol server providing structured access to Cham.ai's data and services for external AI systems.

### Trust Scoring System
Dynamic reputation scoring that evaluates members based on contribution history, community feedback, and AI-assessed behavior patterns.

---

## Architecture

### Frontend
- **Next.js 14 App Router**: React framework with server-side rendering
- **Tailwind CSS**: Utility-first styling system
- **GSAP animations**: Smooth, performant animations
- **shadcn/ui**: Component library with radix primitives

### Backend
- **Streamlit (app.py)**: Python backend for AI agents and business logic
- **PayPal REST SDK**: Payment processing and integration
- **LangChain**: AI agent framework and tool orchestration

### Database
- **PostgreSQL**: Relational database with ACID compliance
- **Drizzle ORM**: TypeScript-first ORM for database interactions

### Auth
- **Neon Managed Better Auth**: Modern authentication with user management

---

## Quick Start

1. **Clone the repository**
   ash
   git clone https://github.com/Veeresh-Math/chama-ai.git
   cd chama-ai
   

2. **Install dependencies**
   ash
   npm install
   

3. **Copy environment file**
   ash
   cp .env.example .env.local
   

4. **Set environment variables** (see below)

5. **Push database schema**
   ash
   npm run db:push
   

6. **Run development server**
   ash
   npm run dev
   

7. **Visit the application**
   Open http://localhost:3000 in your browser

---

## Environment Variables

Required environment variables for Cham.ai:

| Variable | Description |
|----------|-------------|
| **DATABASE_URL** | PostgreSQL connection string (Neon) |
| **NEXT_PUBLIC_SUPABASE_URL** | Supabase project URL |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Supabase anonymous key |
| **SUPABASE_SERVICE_ROLE_KEY** | Supabase service role key |
| **OPENAI_API_KEY** | OpenAI API key for LangChain agent |
| **PAYPAL_MODE** | PayPal environment (sandbox/production) |
| **PAYPAL_CLIENT_ID** | PayPal REST API client ID |
| **PAYPAL_CLIENT_SECRET** | PayPal REST API client secret |
| **PAYPAL_WEBHOOK_ID** | PayPal webhook ID for event handling |

Additional optional variables:

| Variable | Description |
|----------|-------------|
| **NEON_AUTH_BASE_URL** | Neon Better Auth base URL |
| **NEON_AUTH_COOKIE_SECRET** | Secret for auth cookies |

---

## Demo Walkthrough

[![Video Walkthrough](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

**Video demonstrating Cham.ai's key features (3 minutes):**

1. **Create account ? Start circle**: New users register and create their first savings circle with initial parameters and member invites.

2. **Members contribute ? Trust scoring**: Circle members contribute funds, with their trust scores dynamically updated based on contribution behavior and community feedback.

3. **AI analyzes treasury ? Agent Council consensus**: The AI Financial Copilot analyzes treasury performance, and the Agent Council (Trust/Compliance/Treasury) reaches consensus on optimal investment strategies.

4. **Approve ? PayPal Payout execution**: The council approves investment decisions, triggering automatic PayPal payouts to members or reinvestment in the treasury.

---

## License

Distributed under the MIT License. See LICENSE for more information.

---

<div align="center">
  <p>
    <a href="https://github.com/Veeresh-Math/chama-ai">? Star on GitHub</a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="https://github.com/Veeresh-Math/chama-ai/issues">?? Report Bug</a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="https://github.com/Veeresh-Math/chama-ai/issues">? Request Feature</a>
  </p>
  
  **PayPal AI Hackathon 2026 • Best Use of PayPal + AI • ($000 Prize)**
</div>

