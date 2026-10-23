'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animations';
import { Container, CtaLink } from './primitives';

export default function FinalCta() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('chamaai_logged_in') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className="pb-28 pt-14 sm:pb-36">
      <Container>
        <ScrollReveal direction="up" distance={30}>
          <div className="flex flex-col items-center text-center">
            <h2 className="max-w-[808px] bg-[linear-gradient(0deg,rgba(21,21,21,0)_0%,rgba(21,21,21,0.65)_56%,rgba(21,21,21,0.85)_100%)] bg-clip-text text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.04em] text-transparent">
              Run your next cycle in 90 seconds
            </h2>

            <p className="mt-8 max-w-[540px] text-base leading-[1.5] text-black/50">
              Create a circle, invite your members and watch the agent handle
              contributions, approvals, payouts and receipts — with PayPal under
              every transaction.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={isLoggedIn ? '/dashboard' : '/signup'}>
                {isLoggedIn ? 'Go to your Dashboard' : 'Start your chama — free'}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink href="#demo" variant="ghost">
                Rewatch the 90-second flow
              </CtaLink>
            </div>

            <p className="mt-6 text-[13px] text-black/40">
              No credit card · Cancel anytime · Export your ledger whenever you want
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
