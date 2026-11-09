'use client';

import * as React from 'react';
import { ArrowRight, Users, CreditCard, Send } from 'lucide-react';
import { ScrollReveal } from '@/components/animations';
import { Container, SectionHeading } from './primitives';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: Users,
    title: 'Open the circle',
    body: 'Name it, set the contribution amount and cadence, invite members by link. Everyone sees the same ledger from minute one.',
    meta: '60 seconds',
  },
  {
    icon: CreditCard,
    title: 'Members contribute',
    body: 'Contributions run through PayPal Checkout with webhooks confirming each payment — no spreadsheet reconciliation, no "I sent it last week".',
    meta: 'Every cycle',
  },
  {
    icon: Send,
    title: 'Distribute on approval',
    body: 'When a cycle closes, the agent proposes the split, a human approves it, and Payouts settles everyone at once with receipts for each.',
    meta: 'One approval',
  },
];

export default function HowItWorks() {
  // One step visible at a time; visitors click through at their own pace.
  const [active, setActive] = React.useState(0);
  const step = steps[active];
  const Icon = step.icon;

  return (
    <section id="how" className="py-28 sm:py-40">
      <Container>
        <SectionHeading
          badge="How it works"
          align="center"
          title="Three moves from group chat to governed fund"
          lede="The whole lifecycle — contributions in, decisions made, money out — stays inside one auditable flow."
        />

        {/* Step selector */}
        <ScrollReveal direction="up" distance={30}>
          <div
            role="tablist"
            aria-label="How it works steps"
            className="mx-auto mt-14 flex w-fit items-center gap-2 rounded-2xl bg-black/5 p-1.5"
          >
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const selected = i === active;
              return (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
                    selected ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black'
                  )}
                >
                  <span className="font-display text-black/25">
                    0{i + 1}
                  </span>
                  <StepIcon className="h-4 w-4" aria-hidden="true" />
                  {s.title}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active step only */}
        <ScrollReveal direction="up" distance={20} className="mt-3">
          <article
            key={step.title}
            className="mx-auto flex max-w-[720px] flex-col rounded-3xl bg-black/5 p-8 sm:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] bg-black text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-black/10">
                0{active + 1}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-medium leading-[1.1] tracking-[-0.03em] text-black">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-[1.4] text-black/50">{step.body}</p>
            <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-5">
              <p className="flex items-center gap-2 text-sm font-medium text-black/60">
                {step.meta}
              </p>
              {active < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActive(active + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Next step
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <span className="text-sm font-medium text-black/40">That&apos;s the whole loop</span>
              )}
            </div>
          </article>
        </ScrollReveal>
      </Container>
    </section>
  );
}
