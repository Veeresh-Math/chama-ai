'use client';

import { ScrollReveal, StaggerContainer } from '@/components/animations';
import { Container } from './primitives';

const testimonials = [
  {
    quote:
      'We used to argue about the spreadsheet every cycle. Now the agent proposes the split, someone approves it, and everyone gets a receipt the same afternoon.',
    name: 'Sarah K.',
    role: 'Treasurer, Nairobi Chamas Network',
    metric: '22 members · 14 cycles settled',
  },
  {
    quote:
      'Escrow was the reason we stayed. Funds release per milestone, the client approves, and nobody has to trust anybody’s word about what was delivered.',
    name: 'James M.',
    role: 'Founder, Mombasa Investment Group',
    metric: '$48k pooled to date',
  },
  {
    quote:
      'The trust score changed behaviour. People contribute on time because the record travels with them — and we spotted a fake payment attempt through a webhook.',
    name: 'Amina J.',
    role: 'Coordinator, Kisumu Women’s Collective',
    metric: '96% on-time contributions',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-night pb-28 text-white sm:pb-40">
      <Container>
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center">
            <p className="chip-dark justify-center">In the field</p>
            <h2 className="mx-auto mt-6 max-w-[900px] bg-[linear-gradient(203deg,rgba(255,255,255,1)_35%,rgba(255,255,255,0.45)_100%)] bg-clip-text text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-transparent">
              Groups that stopped arguing about money
            </h2>
            <p className="mx-auto mt-5 max-w-[540px] text-base leading-[1.4] text-white/50">
              Savings circles, investment groups and gig teams running real cycles
              on Cham.ai.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30}>
          <StaggerContainer className="mt-14 grid gap-3 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-8"
              >
                <blockquote className="flex-1 text-[15px] leading-[1.55] text-white/70">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-[15px] font-medium text-white">{t.name}</p>
                  <p className="mt-0.5 text-[13px] text-white/50">{t.role}</p>
                  <p className="mt-3 inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white/70">
                    {t.metric}
                  </p>
                </figcaption>
              </figure>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </Container>
    </section>
  );
}
