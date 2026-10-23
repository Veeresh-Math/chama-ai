'use client';

import { Check } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '@/components/animations';
import { Container, CtaLink, SectionHeading } from './primitives';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    blurb: 'One circle, full visibility. Enough to run a real cycle.',
    features: [
      '1 savings circle, up to 15 members',
      'PayPal Checkout contributions',
      'AI copilot — 50 messages / month',
      'Trust scoring & contribution ledger',
      'Exportable transaction history',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Collective',
    price: '$19',
    cadence: 'per month',
    blurb: 'For groups that distribute money every cycle and need the paper trail.',
    features: [
      'Unlimited circles & members',
      'Approval gate + spending limits',
      'Batch payouts with receipts',
      'Immutable audit log',
      'Gig milestone escrow',
      'AI copilot — unlimited',
      'PayPal & PYUSD settlement rails',
    ],
    cta: 'Start 14-day trial',
    featured: true,
  },
  {
    name: 'Network',
    price: 'Custom',
    cadence: 'annual',
    blurb: 'For federations, co-ops and platforms embedding Cham.ai.',
    features: [
      'Everything in Collective',
      'Roles, permissions & SSO',
      'MCP + API access for your agents',
      'Multi-circle treasury view',
      'Dedicated onboarding & support',
    ],
    cta: 'Talk to us',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 sm:py-40">
      <Container>
        <SectionHeading
          badge="Pricing"
          align="center"
          title="Free until you're distributing"
          lede="Create a circle, run a full contribution cycle and see every receipt — before you pay anything."
        />

        <ScrollReveal direction="up" distance={30}>
          <StaggerContainer className="mt-14 grid items-start gap-3 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'flex flex-col rounded-3xl p-8 transition-transform duration-300 sm:p-10',
                  tier.featured
                    ? 'bg-night text-white lg:-translate-y-3'
                    : 'bg-black/5 text-black'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      'text-lg font-medium tracking-[-0.02em]',
                      tier.featured ? 'text-white' : 'text-black'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-black">
                      Most chosen
                    </span>
                  )}
                </div>

                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-[2.5rem] font-medium leading-none tracking-[-0.03em] tabular-nums">
                    {tier.price}
                  </span>
                  <span
                    className={cn(
                      'text-[13px] font-medium',
                      tier.featured ? 'text-white/50' : 'text-black/40'
                    )}
                  >
                    {tier.cadence}
                  </span>
                </p>

                <p
                  className={cn(
                    'mt-3 text-[15px] leading-[1.4]',
                    tier.featured ? 'text-white/60' : 'text-black/50'
                  )}
                >
                  {tier.blurb}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        'flex items-start gap-2.5 text-[14.5px] leading-[1.4]',
                        tier.featured ? 'text-white/75' : 'text-black/65'
                      )}
                    >
                      <Check
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          tier.featured ? 'text-white' : 'text-black'
                        )}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <CtaLink href="/signup" className="mt-8 w-full">
                  {tier.cta}
                </CtaLink>
              </div>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </Container>
    </section>
  );
}
