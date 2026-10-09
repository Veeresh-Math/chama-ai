# chama.ai 🚀


## AI-Powered Wealth Collective 🌟

_Transform communities into thriving wealth ecosystems where members save, invest, and grow together_

<br/>

<div align="center">

  <a href="https://github.com/Veeresh-Math/chama-ai">
    <img src="https://img.shields.io/github/stars/Veeresh-Math/chama-ai?style=for-the-badge&amp;color=ff0066" alt="GitHub stars">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/observations">
    <img src="https://img.shields.io/github/issues/Veeresh-Math/chama-ai?style=for-the-badge&amp;color=ffff00" alt="GitHub issues">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Veeresh-Math/chama-ai?style=for-the-badge&amp;color=00d099" alt="GitHub contributors">
  </a>
  <a href="https://github.com/Veeresh-Math/chama-ai/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Veeresh-Math/chama-ai?style=for-the-badge&amp;color=6c757d" alt="License: MIT">
  </a>

</div>

<br/>

## 🏝️ What is Cham.ai?

**Cham.ai** is a Next.js 14-powered platform that enables communities to pool resources, make collective investment decisions, and grow wealth together using AI-powered insights. Built with TypeScript, Tailwind CSS, and shadcn/ui components, it provides a beautiful, responsive experience for modern financial communities.

<br/>

## 🎨 Design System

### Color Palette

| Color | Tailwind Class | Usage |
|-------|----------------|-------|
| <div style="background: #ff0066; width: 20px; height: 20px; border-radius: 4px;"></div> | `paypalPink` | Primary actions, highlights |
| <div style="background: #00d099; width: 20px; height: 20px; border-radius: 4px;"></div> | `paypalGreen` | Success, growth metrics |
| <div style="background: #6366f1; width: 20px; height: 20px; border-radius: 4px;"></div> | `electricViolet` | Secondary actions, accents |
| <div style="background: #f472b6; width: 20px; height: 20px; border-radius: 4px;"></div> | `roseQuartz` | Secondary highlights |
| <div style="background: #14b8a6; width: 20px; height: 20px; border-radius: 4px;"></div> | `tealCyan` | Information, features |
| <div style="background: #a855f7; width: 20px; height: 20px; border-radius: 4px;"></div> | `electricPurple` | Premium features |
| <div style="background: #f97316; width: 20px; height: 20px; border-radius: 4px;"></div> | `orangeEnergy` | Warnings, call-to-action |

### Typography

```css
/* Heading Scale */
text-hero       : 6xl font-bold leading-tight
text-display    : 5xl font-bold tracking-tight
text-header     : 3xl font-semibold tracking-tight
text-title      : 2xl font-medium tracking-tight
text-label      : xl font-medium

/* Body & Caption */
text-body       : lg font-normal leading-relaxed
text-caption    : sm text-muted-foreground
```

### Component Library

Built with **shadcn/ui** components enhanced with custom Tailwind utilities:

- `GlassCard` - Frosted glass effect with backdrop blur
- `PayPalButton` - Primary CTA with pink gradient
- `CommunityCard` - Rounded corners with subtle shadows
- `TrustBadge` - Animated checkmark for verified communities
</div>

<br/>

## 🛠️ Technology Stack

<div align="left">

| Category | Technologies |
|----------|-------------|
| ⚡ **Framework** | Next.js 14 (App Router) |
| 🎨 **Styling** | Tailwind CSS 3.4, shadcn/ui |
| 📊 **State** | React Query, SWR |
| 🔄 **Animations** | Framer Motion |
| 📦 **UI Icons** | Lucide React |
| 🤖 **AI/ML** | Custom inference endpoints |
| 🗄️ **Database** | PostgreSQL with Prisma ORM |
| 🚀 **Deployment** | Vercel |

</div>

<br/>

## 🚀 Getting Started

### Prerequisites

```bash
pnpm install  # or npm install / yarn
Node.js 18+  
```

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
# Fill in your environment variables
```

```env
# .env.example
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
pnpm dev
# Opens at http://localhost:3000
```

<br/>

## 🏗️ Project Structure

```
chama-ai/
├── .github/              # GitHub Actions workflows
├── .kilo/                # Kilo AI config
├── backend/              # Node.js/Express API
├── frontend/             # Next.js 14 app
│   ├── app/              # App Router pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── community/    # Community management
│   │   ├── investment/   # Investment pools
│   │   └── api/          # API routes
│   ├── components/       # UI components (shadcn/ui)
│   │   ├── ui/           # Base components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Utilities & helpers
│   └── styles/           # Custom Tailwind configs
├── .env.example          # Environment variables template
├── package.json          # Root package config
├── turbo.json            # Task pipeline config
└── README.md             # This file 🎉
```

<br/>

## ✨ Features Highlights

### Core Features

<div align="left">

| Feature | Description | Badge |
|---------|-------------|-------|
| 🌐 **Community Circles** | Create & manage savings circles with trusted members | [![badge](#)](#) |
| 💰 **Investment Pools** | Collective investment with AI-powered recommendations | [![badge](#)](#) |
| 📊 **Real-time Analytics** | Dashboard with interactive charts & trends | [![badge](#)](#) |
| 🤖 **AI Financial Copilot** | Personalized insights & investment advice | [![badge](#)](#) |
| 🔐 **Secure Transactions** | End-to-end encryption & multi-sig wallets | [![badge](#)](#) |
| 🌍 **Multi-currency** | Support for USD, KES, NGN, and more | [![badge](#)](#) |

</div>

### Coming Soon

<div style="background: linear-gradient(135, #0a0a0f 0%, #1e1e2f 100%); padding: 2rem; border-radius: 12px; border: 1px solid #333;">
<h3 style="color: #ff0066; margin-bottom: 1rem;">🚀 Roadmap</h3>
<ul style="color: #cbd5e1;">
<li>AI-powered portfolio rebalancing</li>
<li>Integrated marketplace for community assets</li>
<li>Mobile PWA application</li>
<li>Advanced analytics & forecasting</li>
<li>Referral rewards program</li>
</ul>
</div>

<br/>

## 📦 Deployment

### Vercel (Recommended)

```bash
pnpm build
pnpm deploy
```

### Docker

```bash
docker build -t chama-ai .
docker run -p 3000:3000 -e DATABASE_URL=$DATABASE_URL chama-ai
```

### Manual Deployment

1. **Build**: `pnpm build`
2. **Start**: `pnpm start`
3. **Environment**: Ensure all `.env.local` variables are set

### Vercel Dashboard

Connect your GitHub repository `Veeresh-Math/chama-ai` to Vercel for automatic deployments on every push to `main`.

<br/>

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<div align="center">
<p>⭐ Star this repo if you find it helpful!</p>
</div>

<br/>

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<br/>

---
<div align="center">

Made with ❤️ by the Cham.ai Community

</div>
