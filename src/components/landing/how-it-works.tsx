'use client';

import { ArrowRight, Users, CreditCard, Send } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '@/components/animations';
import { Container, SectionHeading } from './primitives';

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
    <section id="how" className="py-28 sm:py-40">
      <Container>
        <SectionHeading
          badge="How it works"
          align="center"
          title="Three moves from group chat to governed fund"
          lede="The whole lifecycle — contributions in, decisions made, money out — stays inside one auditable flow."
        />

        <ScrollReveal direction="up" distance={30}>
          <StaggerContainer className="mt-14 grid gap-3 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="flex min-h-[320px] flex-col rounded-3xl bg-black/5 p-8 transition-colors duration-300 sm:p-10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] bg-black text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-black/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-medium leading-[1.1] tracking-[-0.03em] text-black">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-[1.4] text-black/50">{step.body}</p>
                  <p className="mt-auto flex items-center gap-2 border-t border-black/10 pt-5 text-sm font-medium text-black/60">
                    {step.meta}
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 md:hidden" aria-hidden="true" />
                    )}
                  </p>
                </article>
              );
            })}
          </StaggerContainer>
        </ScrollReveal>
      </Container>
    </section>
  );
}
