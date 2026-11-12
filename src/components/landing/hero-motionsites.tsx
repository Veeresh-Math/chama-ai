'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/client';

const brands = ['PayPal', 'PYUSD', 'Arbitrum', 'Solana', 'LangChain', 'Neon', 'MCP'];

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('w-7 h-7', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    >
      <path d="M128 191C128 156 157 128 192 128L192 64L128 64C128 99 99 128 64 128L64 192L128 192ZM192 256L64 256C29 256 0 227 0 192L0 64L64 64L64 0L192 0C227 0 256 29 256 64L256 192L192 192Z" />
    </svg>
  );
}

function Marquee({ className, speed = '22s' }: { className?: string; speed?: string }) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="flex w-max animate-marquee" style={{ animationDuration: speed }}>
        {brands.map((b) => (
          <span
            key={b}
            className="mx-7 shrink-0 whitespace-nowrap text-black/60"
            style={{ letterSpacing: '-0.02em', fontSize: '15px' }}
          >
            {b}
          </span>
        ))}
        {brands.map((b) => (
          <span
            key={b + '-2'}
            className="mx-7 shrink-0 whitespace-nowrap text-black/60"
            style={{ letterSpacing: '-0.02em', fontSize: '15px' }}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function CtaPill({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 active:scale-[0.98]',
        className
      )}
    >
      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-xs font-bold">
        <ArrowRight className="h-3 w-3" />
      </span>
      {children}
    </button>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm flex flex-col">
      <div className="text-2xl font-medium tabular-nums text-black tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-black/50">{label}</div>
    </div>
  );
}

export default function HeroMotionsites() {
  const auth = useAuth();
  const isLoggedIn = auth.status === 'authenticated';
  const ctaHref = isLoggedIn ? '/dashboard' : '/signup';

  return (
    <section className="relative overflow-hidden bg-[#EAEAEA] pt-36 pb-36 sm:pt-44 sm:pb-36">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-8">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7" />
              <span className="text-2xl font-medium tracking-tight text-black">Cham<span className="text-black/40">.ai</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-base text-gray-700 font-medium transition-colors duration-200">
              <a href="#features" className="hover:text-black">Product</a>
              <a href="#how" className="hover:text-black">How it works</a>
              <a href="#security" className="hover:text-black">Security</a>
              <a href="#pricing" className="hover:text-black">Pricing</a>
              <a href="#faq" className="hover:text-black">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-base font-medium text-black/55 transition-colors hover:text-black">
                  {auth.user?.name?.split(' ')[0] ?? 'Dashboard'}
                </Link>
              ) : (
                <Link href="/login" className="text-base font-medium text-black/55 transition-colors hover:text-black">
                  Sign in
                </Link>
              )}
              <CtaPill onClick={() => {}} className="px-7 py-2.5 text-base font-medium">
                {isLoggedIn ? 'Dashboard' : 'Sign up'}
              </CtaPill>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="mt-32 flex flex-col items-start justify-start h-full p-0 sm:p-12 pt-0 sm:pt-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60 backdrop-blur-md ring-1 ring-white/10 mb-6">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="tracking-tight">PayPal AI Hackathon 2026 Submission</span>
          </div>

          <h1 className="text-black text-[clamp(2.75rem,9vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em] max-w-[900px] mb-6">
            Pool money.<br />
            <span className="font-serif italic">Decide together.</span>
          </h1>

          <p className="text-black/70 text-base md:text-lg max-w-md mb-8 leading-relaxed font-sans">
            Agentic commerce for community savings and gig escrow.
            <br />
            <span className="block mt-1 text-black/90 font-medium">Autonomous treasury. Instant PayPal settlement.</span>
          </p>

          <CtaPill
            onClick={() => {}}
            className="px-7 py-2.5 text-base font-medium"
          >
            {isLoggedIn ? 'Go to Command Center' : 'Start your collective — free'}
            <ArrowRight className="h-4 w-4 text-black" />
          </CtaPill>

          {/* Brand Marquee */}
      <div className="mt-24 w-full max-w-md overflow-hidden">
        <Marquee speed="22s" />
      </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-20 flex items-center justify-between gap-24 px-6 sm:px-8 py-10 text-black border-t border-black/10">
          <StatCard value="$48,920" label="Total Pool Value" />
          <StatCard value="3" label="Active Circles" />
          <StatCard value="98.2%" label="Agent Trust Score" />
          <StatCard value="$1,200" label="Pending Escrows" />
        </div>
      </div>
    </section>
  );
}
