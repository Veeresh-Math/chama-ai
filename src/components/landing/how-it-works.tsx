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
  return (
    <section id="how" className="py-28 sm:py-40 scroll-mt-[120px]">
      <Container>
        <SectionHeading
          badge="How it works"
          align="center"
          title="Three moves from group chat to governed fund"
          lede="The whole lifecycle — contributions in, decisions made, money out — stays inside one auditable flow."
        />

        {/* Step cards — all three visible, aligned */}
        <ScrollReveal direction="up" distance={20} className="mt-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className={cn(
                    'group flex flex-col rounded-3xl border border-black/5 bg-white p-8 sm:p-10 transition-transform duration-300',
                    'hover:border-black/20 hover:shadow-xl hover:-translate-y-1'
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/5 text-[12px] font-medium text-black">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium leading-[1.1] tracking-[-0.03em] text-black mb-3 group-hover:text-black/80 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-base leading-[1.4] text-black/50 mb-6 flex-1">
                    {step.body}
                  </p>
                  <div className="mt-auto flex items-center gap-2 rounded-xl border border-black/5 px-3 py-2 text-sm font-medium text-black/60 bg-black/5">
                    <span>{step.meta}</span>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-black/40 group-hover:text-black transition-colors" aria-hidden="true" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
