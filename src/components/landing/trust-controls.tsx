'use client';

import * as React from 'react';
import {
  Gauge,
  CheckCircle2,
  ReceiptText,
  Undo2,
  ScrollText,
  FileKey2,
  CreditCard,
  BadgeCheck,
  Send,
  Coins,
} from 'lucide-react';
import { Container, SectionHeading } from './primitives';
import { cn } from '@/lib/utils';

const groups = [
  { id: 'limits', label: 'Limits' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'rails', label: 'PayPal rails' },
] as const;

type GroupId = (typeof groups)[number]['id'];

const controls: { group: GroupId; icon: React.ElementType; title: string; body: string }[] = [
  {
    group: 'limits',
    icon: Gauge,
    title: 'Spending limits',
    body: 'A per-cycle cap on every circle. Exceed it and the agent stops and escalates instead of executing.',
  },
  {
    group: 'approvals',
    icon: CheckCircle2,
    title: 'Confirmation before payment',
    body: 'Amount, recipients and purpose are shown together. Money never moves without an explicit approval.',
  },
  {
    group: 'approvals',
    icon: Undo2,
    title: 'Cancel while pending',
    body: 'Payouts still in pending state can be cancelled from the same screen that approved them.',
  },
  {
    group: 'receipts',
    icon: ReceiptText,
    title: 'Receipts for every transfer',
    body: 'Each payout writes a receipt with batch ID, per-recipient status and settlement timestamp.',
  },
  {
    group: 'receipts',
    icon: ScrollText,
    title: 'Immutable audit log',
    body: 'Who asked, what the agent planned, who approved, what PayPal returned — append-only and exportable.',
  },
  {
    group: 'webhooks',
    icon: FileKey2,
    title: 'Verified webhook callbacks',
    body: 'Every PayPal webhook signature is verified before it can touch your ledger. Unsigned events are rejected.',
  },
];

const rails = [
  {
    icon: CreditCard,
    name: 'Checkout',
    use: 'Members contribute to a cycle with PayPal Checkout — approval URL returned by the agent, executed on return.',
  },
  {
    icon: BadgeCheck,
    name: 'Orders & webhooks',
    use: 'Every payment event is signature-verified before it updates balances or trust scores.',
  },
  {
    icon: Send,
    name: 'Payouts',
    use: 'Batch distributions to the whole circle, and milestone releases to gig workers.',
  },
  {
    icon: Coins,
    name: 'PYUSD settlement',
    use: 'Stablecoin settlement rails for members who want dollar-denominated finality.',
  },
];

const stack = [
  'PayPal Agent Toolkit',
  'MCP server · 8 tools',
  'APIMatic Context Plugin',
  'LangChain agent runtime',
];

function Card({
  group,
  children,
  className,
}: {
  group: GroupId;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-group={group}
      className={cn('rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8', className)}
    >
      {children}
    </div>
  );
}

export default function TrustControls() {
  const [active, setActive] = React.useState<GroupId>('limits');
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-group]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const group = (entry.target as HTMLElement).dataset.group as GroupId;
            if (group) setActive(group);
          }
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goTo = (group: GroupId) => {
    setActive(group);
    const target = listRef.current?.querySelector<HTMLElement>(`[data-group="${group}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="security" className="relative z-10 -mt-10 rounded-t-[40px] bg-night py-28 text-white sm:py-40">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <SectionHeading
              tone="dark"
              align="left"
              badge="Trust controls"
              title="An agent you can hand the money to"
              lede="Payments demand safety. Every Cham.ai transaction sits behind limits, explicit approval, receipts and a log you can hand to an auditor — enforced in the transaction path, not in a settings page nobody opens."
            />

            <div className="mt-8 flex flex-wrap gap-2" aria-label="Jump to section">
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => goTo(group.id)}
                  aria-pressed={active === group.id}
                  className={cn(
                    'rounded-xl px-3.5 py-2 text-[13px] font-medium leading-[0.95] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                    active === group.id
                      ? 'bg-white text-black'
                      : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <p className="mt-8 max-w-[420px] text-sm leading-relaxed text-white/50">
              A payout that violates a limit never reaches the PayPal API. Controls
              are enforced in the transaction path — approvals, receipts and the
              audit log are part of every transfer.
            </p>
          </div>

          <div ref={listRef} className="flex flex-col gap-3">
            {controls.map((control) => {
              const Icon = control.icon;
              return (
                <Card key={control.title} group={control.group}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-white/10 text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium leading-[1.15] tracking-[-0.02em] text-white">
                        {control.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[1.5] text-white/50">
                        {control.body}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card group="rails">
              <p className="chip-dark inline-flex">PayPal-native</p>
              <h3 className="mt-5 text-[clamp(1.35rem,2.4vw,1.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white">
                PayPal is the payment layer — not a button in the footer
              </h3>
              <p className="mt-3 max-w-[560px] text-[15px] leading-[1.5] text-white/50">
                Every money movement in Cham.ai goes through a PayPal API with a
                matching verification step. The agent is wired to those APIs, so it
                can transact instead of merely recommend.
              </p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {rails.map((rail) => {
                  const Icon = rail.icon;
                  return (
                    <li
                      key={rail.name}
                      className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-white/10 text-white">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-medium text-white">{rail.name}</h4>
                        <p className="mt-0.5 text-[13.5px] leading-[1.45] text-white/50">
                          {rail.use}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {stack.map((item) => (
                  <li
                    key={item}
                    className="list-none rounded-lg bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-medium text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
