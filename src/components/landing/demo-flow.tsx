'use client';

import * as React from 'react';
import { Check, ShieldCheck, Terminal, Wallet } from 'lucide-react';
import { ScrollReveal } from '@/components/animations';
import { Container, SectionHeading } from './primitives';
import { cn } from '@/lib/utils';

const panels = [
  {
    title: 'You ask, in plain English',
    body: 'One sentence in the copilot — no forms, no dashboard hunting.',
  },
  {
    title: 'The agent reasons with real data',
    body: 'Reads balances, contribution history and trust scores — then plans the exact split.',
  },
  {
    title: 'You approve before money moves',
    body: 'Amount, recipients and limit check shown together. Deny and nothing happens.',
  },
  {
    title: 'Receipt + audit log, automatically',
    body: 'Batch ID, per-recipient status and webhook confirmation written to your ledger.',
  },
];

function AskPanel() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[14px] leading-[1.4] text-black">
        Send $1,250 to the six members who hit their cycle-14 targets.
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-[14px] leading-[1.45] text-white/70">
          Got it — checking cycle 14 balances, contribution history and trust
          scores before anything moves.
        </p>
      </div>
    </div>
  );
}

function ReasonPanel() {
  const lines = [
    { tool: 'get_community_data', arg: 'cycle: 14', out: '22 members · pool $48,920' },
    { tool: 'analyze_community_trust', arg: 'threshold ≥ 75', out: '6 eligible · score 86' },
    { tool: 'create_split_payment', arg: '$1,250.00 → 6', out: 'within $2,000 limit ✓' },
  ];
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-mono text-[12px] leading-relaxed">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-white/50">
        <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
        agent trace
      </div>
      <ul className="mt-3 space-y-2.5">
        {lines.map((line) => (
          <li key={line.tool} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-white">→ {line.tool}</span>
            <span className="text-white/40">({line.arg})</span>
            <span className="ml-auto text-white/70">{line.out}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApprovePanel() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-2 text-[13px] font-medium text-white">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Confirmation required — money has not moved
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-white/40">
          PayPal payout
        </span>
        <span className="font-display text-2xl font-medium tabular-nums text-white">
          $1,250.00
        </span>
      </div>
      <p className="mt-1 text-[13px] text-white/50">
        6 recipients · limit $2,000/cycle · $750 remaining
      </p>
      <div className="mt-5 flex gap-2">
        <span className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-white/20 text-[13px] font-medium text-white/70">
          Deny
        </span>
        <span className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-medium text-black">
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          Approve payout
        </span>
      </div>
    </div>
  );
}

function SettledPanel() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-2 text-[13px] font-medium text-white">
        <Wallet className="h-4 w-4" aria-hidden="true" />
        Payout batch settled
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/70">
        <span className="font-mono">PAY-8241-CHAMA</span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> 6/6
          recipients paid
        </span>
      </div>
      <p className="mt-2 text-[12.5px] text-white/50">
        Receipt filed · webhook verified · audit log updated
      </p>
    </div>
  );
}

const panelContent = [<AskPanel key="ask" />, <ReasonPanel key="reason" />, <ApprovePanel key="approve" />, <SettledPanel key="settled" />];

export default function DemoFlow() {
  const [active, setActive] = React.useState(0);

  return (
    <section id="demo" className="pb-28 sm:pb-40">
      <Container>
        <ScrollReveal direction="up" distance={30}>
          <div className="rounded-[40px] bg-night p-6 sm:p-12 lg:p-16">
            <SectionHeading
              tone="dark"
              align="left"
              badge="The 90-second demo"
              title="From one sentence to settled money"
              lede="No product tour. One request, one approval, one real PayPal transaction — with the reasoning visible the whole way."
            />

            <div className="mt-12 grid gap-4 lg:grid-cols-[360px_1fr]">
              <div
                role="tablist"
                aria-label="Demo steps"
                className="flex flex-col gap-2"
              >
                {panels.map((panel, i) => (
                  <button
                    key={panel.title}
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    onClick={() => setActive(i)}
                    className={cn(
                      'w-full rounded-2xl p-5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                      active === i
                        ? 'bg-white/[0.08] ring-1 ring-white/15'
                        : 'hover:bg-white/[0.04]'
                    )}
                  >
                    <span
                      className={cn(
                        'block text-[15px] font-medium leading-[1.15] tracking-[-0.02em]',
                        active === i ? 'text-white' : 'text-white/70'
                      )}
                    >
                      {panel.title}
                    </span>
                    <span
                      className={cn(
                        'mt-1.5 block text-[13.5px] leading-[1.4]',
                        active === i ? 'text-white/60' : 'text-white/40'
                      )}
                    >
                      {panel.body}
                    </span>
                  </button>
                ))}

                <div className="mt-3 flex gap-1.5 px-1" aria-hidden="true">
                  {panels.map((panel, i) => (
                    <span
                      key={panel.title}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        active === i ? 'w-8 bg-white' : 'w-4 bg-white/20'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div
                role="tabpanel"
                className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10"
              >
                <React.Fragment key={active}>{panelContent[active]}</React.Fragment>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
