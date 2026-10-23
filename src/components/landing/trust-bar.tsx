'use client';

import { ScrollReveal } from '@/components/animations';
import { Container } from './primitives';

const stats = [
  { value: '60s', label: 'to stand up a new savings circle' },
  { value: '8', label: 'financial tools exposed to AI agents' },
  { value: '24/7', label: 'copilot watching contributions & risk' },
  { value: '2 rails', label: 'PayPal payouts and PYUSD settlement' },
];

const stack = ['PayPal', 'PYUSD', 'Arbitrum', 'Solana', 'LangChain', 'PostgreSQL'];

export default function TrustBar() {
  return (
    <section aria-label="Platform facts" className="pt-36 sm:pt-44">
      <Container>
        <ScrollReveal direction="up" distance={24} duration={0.6}>
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-[60px]">
            <div>
              <p className="chip">AI-powered wealth collective</p>
              <h2 className="mt-6 text-[clamp(1.75rem,3.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.02em] text-black">
                Here, you stop arguing about the spreadsheet and start working with
                your circle.
              </h2>
              <p className="mt-6 max-w-[560px] text-[clamp(1.25rem,2.4vw,1.5rem)] font-normal leading-[1.3] tracking-[-0.01em] text-black/50">
                Clear tools for savings circles, investment groups and gig teams —
                contributions, trust and payouts in one auditable flow.
              </p>
            </div>

            <div className="rounded-3xl bg-black/5 p-8 sm:p-10">
              <dl>
                {stats.map((stat, i) => (
                  <div
                    key={stat.value}
                    className={
                      i === 0
                        ? 'flex items-baseline justify-between gap-6 pb-5'
                        : 'flex items-baseline justify-between gap-6 border-t border-black/10 py-5'
                    }
                  >
                    <dt className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-none tracking-[-0.03em] tabular-nums text-black">
                      {stat.value}
                    </dt>
                    <dd className="max-w-[220px] text-right text-sm leading-[1.3] text-black/50">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-black/10 pt-6">
                {stack.map((name) => (
                  <span key={name} className="chip">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
