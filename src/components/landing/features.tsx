'use client';

import * as React from 'react';
import { Bot, Users, Lock, ShieldCheck, Cable } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '@/components/animations';
import { Container } from './primitives';
import { cn } from '@/lib/utils';

function CopilotVisual() {
  return (
    <div className="space-y-2.5 rounded-2xl bg-white p-4">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-black/5 px-3.5 py-2.5 text-[13px] text-black/70">
        Can we afford to raise contributions to $120?
      </div>
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-night px-3.5 py-2.5 text-[13px] leading-[1.4] text-white/80">
        Yes — 18 of 22 members clear it, and your buffer stays above{' '}
        <span className="font-semibold text-white">$6.4k</span>. I&apos;ll draft the
        vote for tonight.
      </div>
    </div>
  );
}

function CircleVisual() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e0e0e0" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#0f0f0f"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="97.4"
            strokeDashoffset="17.5"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
          82%
        </span>
      </div>
      <div className="text-[13px] leading-[1.4] text-black/50">
        <p className="font-medium text-black">Cycle 14 on track</p>
        18 of 22 members contributed · closes in 3 days
      </div>
    </div>
  );
}

function EscrowVisual() {
  const steps = ['Milestone 1 · delivered', 'Milestone 2 · in review', 'Milestone 3 · locked'];
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn(
            'flex items-center justify-between rounded-xl px-3 py-2 text-[12.5px]',
            i === 0
              ? 'bg-night font-medium text-white'
              : i === 1
                ? 'bg-white text-black/60'
                : 'bg-white text-black/40'
          )}
        >
          <span>{step}</span>
          <span className="font-medium">{i === 0 ? '$400 released' : i === 1 ? '$600 held' : '$1,000 held'}</span>
        </li>
      ))}
    </ol>
  );
}

function TrustVisual() {
  return (
    <div className="rounded-2xl bg-night p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
          Trust score
        </span>
        <span className="font-display text-2xl font-medium text-white">86</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[86%] rounded-full bg-white" />
      </div>
      <p className="mt-2.5 text-[12px] text-white/50">
        On-time contributions 96% · disputes 0 · tenure 14 cycles
      </p>
    </div>
  );
}

function AgentVisual() {
  return (
    <pre className="overflow-x-auto rounded-2xl bg-night p-4 text-[12px] leading-relaxed text-white/70">
      <code>
        <span className="text-white/40"># call Cham.ai from any MCP client</span>
        {'\n'}
        <span className="text-white">POST</span> /api/mcp{'\n'}
        {'{ '}
        <span className="text-white/90">&quot;method&quot;</span>:{' '}
        <span className="text-white/90">&quot;tools/call&quot;</span>,{' '}
        <span className="text-white/90">&quot;params&quot;</span>: {'{ '}
        <span className="text-white/90">&quot;name&quot;</span>:{' '}
        <span className="text-white/90">&quot;distribute_funds&quot;</span> {'}'}
        {'\n}'}
      </code>
    </pre>
  );
}

const features = [
  {
    icon: Bot,
    title: 'An agent that transacts',
    body: 'Not a chatbot that suggests — Cham.ai plans the transfer, checks limits and trust, asks for your confirmation, then executes the PayPal payment and files the receipt. Every step is logged.',
    visual: <CopilotVisual />,
    span: 'lg:col-span-2',
  },
  {
    icon: Users,
    title: 'Savings circles on autopilot',
    body: 'Contribution schedules, reminders, rollovers and distributions handled end to end.',
    visual: <CircleVisual />,
    span: '',
  },
  {
    icon: Lock,
    title: 'Gig milestone escrow',
    body: 'Funds locked per milestone, released on approval — no chasing, no awkwardness.',
    visual: <EscrowVisual />,
    span: '',
  },
  {
    icon: ShieldCheck,
    title: 'Trust scoring that travels',
    body: 'Every member builds a portable record of on-time contributions and clean disputes.',
    visual: <TrustVisual />,
    span: '',
  },
  {
    icon: Cable,
    title: 'Agent-ready by design',
    body: 'An MCP server and ACP discovery manifest expose all 8 financial tools, so your assistant can create a chama, record a contribution or trigger a distribution on your behalf — with API-key auth and rate limits.',
    visual: <AgentVisual />,
    span: 'lg:col-span-2',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 sm:py-40">
      <Container>
        <ScrollReveal direction="up" distance={30}>
          <h2 className="max-w-[1100px] text-[clamp(2.25rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-black">
            Everything a money-pooling group actually needs.
          </h2>
          <p className="mt-6 max-w-[560px] text-base leading-[1.3] text-black/50">
            One workspace for the contributions, the conversations, the compliance
            and the payouts — with an AI copilot that understands collective
            finances.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30}>
          <StaggerContainer className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={cn(
                    'flex min-h-[350px] flex-col justify-between gap-10 rounded-3xl bg-black/5 p-8 transition-colors duration-300 sm:p-10',
                    feature.span
                  )}
                >
                  <div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] bg-black text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-xl font-medium leading-[1.1] tracking-[-0.03em] text-black">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-[560px] text-base leading-[1.35] text-black/50">
                      {feature.body}
                    </p>
                  </div>
                  {feature.visual}
                </article>
              );
            })}
          </StaggerContainer>
        </ScrollReveal>
      </Container>
    </section>
  );
}
