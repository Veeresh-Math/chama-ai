'use client';

import { ScrollReveal, StaggerContainer } from '@/components/animations';
import { Container } from './primitives';

const faqs = [
  {
    q: 'Does Cham.ai ever hold my money?',
    a: 'No. Contributions and payouts move through PayPal accounts you already trust. Cham.ai stores the ledger, the approvals and the receipts — never the balance itself.',
  },
  {
    q: 'How can an AI agent move real money safely?',
    a: 'It cannot — not alone. The agent plans a transaction, then a human approves it. Spending limits are checked before the PayPal API is called, every approval is written to an audit log, and pending payouts can be cancelled.',
  },
  {
    q: 'What can an external AI assistant do with Cham.ai?',
    a: 'Anything your key allows. Cham.ai exposes 8 tools over the Model Context Protocol — create a chama, join, contribute, distribute, read state, analyze trust and manage gigs — with API-key auth and per-key rate limits.',
  },
  {
    q: 'Which PayPal products do you use?',
    a: 'Checkout for contributions, Payouts for distributions and milestone releases, and webhooks for verified payment events.',
  },
  {
    q: 'What happens when a member disputes a contribution?',
    a: 'The contribution is flagged, the cycle stays open, and the dispute plus its resolution are recorded against that member’s trust score. Webhook evidence from PayPal is attached to the case.',
  },
  {
    q: 'Can I get my data out?',
    a: 'Yes — the full ledger, receipts and audit log export as CSV and JSON at any time. Your circle’s history should never be hostage to a platform.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-28 sm:py-40">
      <Container>
        <ScrollReveal direction="up" distance={24}>
          <div className="mx-auto max-w-[670px] text-center">
            <p className="chip justify-center">FAQ</p>
            <h2 className="mt-5 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-balance sm:text-[32px]">
              The questions judges and treasurers both ask
            </h2>
            <p className="mt-4 text-base leading-[1.5] text-black/50">
              Anything else?{' '}
              <a
                href="mailto:hello@cham.ai"
                className="text-azure underline underline-offset-2 hover:text-black"
              >
                Talk to the team
              </a>{' '}
              — a human answers.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={24}>
          <StaggerContainer className="mx-auto mt-10 flex max-w-[670px] flex-col gap-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-3xl bg-black/5 px-7 py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <h3 className="text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-black">
                    {faq.q}
                  </h3>
                  <span
                    className="flex h-[22px] w-9 shrink-0 items-center justify-center rounded-xl bg-black/10 transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 14 8" className="h-2 w-3.5">
                      <path
                        d="M1 1.5 7 6.5 13 1.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="text-black"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3.5 text-[15px] leading-[1.55] text-black/60">{faq.a}</p>
              </details>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </Container>
    </section>
  );
}
