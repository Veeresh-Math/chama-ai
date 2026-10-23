'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/animations';
import { Container, CtaLink } from './primitives';
import LiquidGlass from './liquid-glass';

const members = ['AK', 'JM', 'SN', 'FO', 'MN'];

function ProductMock() {
  const [balance, setBalance] = React.useState(48920);
  const [activity, setActivity] = React.useState('Scanning treasury...');

  const activities = [
    'Treasury Agent optimizing yield...',
    'Compliance check: Cycle 14 validated',
    'PayPal settlement initiated',
    'Trust score updated for 3 members',
    'T-Bill laddering proposal drafted',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="relative group"
    >
      {/* Decorative "System Log" in background to show Agentic activity */}
      <div className="absolute -top-12 -right-8 hidden lg:block w-48 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/40 animate-pulse">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-widest">Live Logs</span>
        </div>
        <div className="truncate">{activity}</div>
      </div>

      <LiquidGlass
            snapshot="#hero-visual-target"
            zIndex={3}
            className="mx-auto w-full max-w-[560px] transition-all duration-500 group-hover:scale-[1.02]"
          >
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.07),transparent_75%)]"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-semibold text-white">
                  KT
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-black tracking-tight">Kibera Traders Collective</p>
                  <p className="text-xs text-gray-500">Cycle 14 · 22 members</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Treasury
              </span>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Current Pool
                </p>
                <p className="mt-1 font-display text-4xl font-medium tracking-[-0.03em] tabular-nums text-black sm:text-5xl">
                  ${balance.toLocaleString()}<span className="text-gray-300">.00</span>
                </p>
              </div>
              <p className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                <TrendingUp className="h-3.5 w-3.5" />
                +12.4%
              </p>
            </div>

            <div className="mt-8 flex h-24 items-end gap-1.5" aria-hidden="true">
              {[38, 52, 44, 63, 58, 74, 69, 86, 78, 92, 88, 100].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={
                    i > 8
                      ? 'flex-1 rounded-sm bg-gradient-to-t from-black to-black/60'
                      : 'flex-1 rounded-sm bg-gray-100'
                  }
                />
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-violet-50/50 p-4 ring-1 ring-violet-100 shadow-sm relative overflow-hidden group/insight">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/30 to-transparent -translate-x-full group-hover/insight:animate-[shimmer_2s_infinite] pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Agent Council Insight
              </div>
              <p className="mt-2 text-[13px] leading-[1.5] text-violet-900/80">
                Laddering T-bills to 14 Mar keeps your idle cash earning{' '}
                <span className="font-bold text-violet-700">+$610</span> before the next
                payout. <span className="text-violet-600 italic">Awaiting your approval...</span>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex -space-x-2">
                {members.map((m) => (
                  <span
                    key={m}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[10px] font-medium text-black ring-1 ring-gray-200"
                  >
                    {m}
                  </span>
                ))}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                  +17
                </span>
              </div>
              <div className="w-1/2">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-medium">Contribution Health</span>
                  <span className="font-bold text-black">82%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[82%] rounded-full bg-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-gray-200 sm:block animate-bounce-subtle">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-200">
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </span>
            <div className="text-left">
              <p className="text-[13px] font-bold text-black tracking-tight">Payout Settled</p>
              <p className="text-xs text-gray-500 leading-relaxed">$1,250 sent to 6 members via PayPal</p>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('chamaai_logged_in') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const ctaHref = isLoggedIn ? '/dashboard' : '/signup';

  return (
    <section
      id="hero-snapshot"
      className="relative overflow-hidden bg-night pb-36 pt-36 sm:pt-44"
    >
      {/* Professional Background: Ambient glow + Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div id="hero-visual-target" className="relative z-10">
        <Container className="relative text-center">
          <div className="flex justify-center mb-8">
            <FadeIn direction="up" distance={20} duration={0.6}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60 backdrop-blur-md ring-1 ring-white/10">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span className="tracking-tight">PayPal AI Hackathon 2026 Submission</span>
              </div>
            </FadeIn>
          </div>

          <h1 className="mx-auto max-w-[900px] text-[clamp(2.75rem,9vw,6rem)] font-normal leading-[0.95] tracking-[-0.04em] text-white">
            <FadeIn direction="up" distance={60} duration={0.9} className="block">
              Pool money.
            </FadeIn>
            <FadeIn direction="up" distance={50} duration={0.9} delay={0.15} className="block">
              Decide{' '}
              <span className="font-serif italic">together.</span>
            </FadeIn>
          </h1>

          <FadeIn direction="up" distance={15} duration={0.6} delay={0.35}>
            <p className="mx-auto mt-8 max-w-[580px] text-lg leading-[1.5] text-white/70">
              Agentic commerce for community savings and gig escrow. 
              <span className="block mt-1 text-white/90 font-medium">Autonomous treasury. Instant PayPal settlement.</span>
            </p>
          </FadeIn>

          <FadeIn direction="up" distance={15} duration={0.6} delay={0.55}>
            <p className="mx-auto mt-6 inline-flex rounded-full bg-white/5 border border-white/10 px-5 py-2 text-sm text-white/80 backdrop-blur-md ring-1 ring-white/10">
              No clutter. No chasing contributions. Just your circle, clearly settled.
            </p>
          </FadeIn>

          <FadeIn direction="up" distance={15} duration={0.6} delay={0.7}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <CtaLink href={ctaHref}>
                {isLoggedIn ? 'Go to Command Center' : 'Start your collective — free'}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink href="#demo" variant="ghost">
                Watch the flow
              </CtaLink>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={30} duration={0.8} delay={0.85}>
            <div className="mt-20">
              <ProductMock />
            </div>
          </FadeIn>
        </Container>
      </div>
    </section>
  );
}
