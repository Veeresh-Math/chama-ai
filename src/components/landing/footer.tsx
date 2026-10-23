'use client';

import { Github } from 'lucide-react';
import { Container, CtaLink, Logo } from './primitives';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'The 90-second demo', href: '#demo' },
      { label: 'Security', href: '#security' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'MCP endpoint', href: '/api/mcp' },
      { label: 'Agent toolkit', href: '#features' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Create an account', href: '/signup' },
      { label: 'Sign in', href: '/login' },
      { label: 'Reset password', href: '/forgot-password' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="pb-10">
      <Container>
        <div className="rounded-3xl bg-panel p-8 text-white sm:p-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Logo dark />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                The AI-powered wealth collective for savings circles, investment pools
                and gig escrow — settled with PayPal and PYUSD.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <CtaLink href="/signup">Start free</CtaLink>
                <a
                  href="https://github.com/Veeresh-Math/chama-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Cham.ai on GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Cham.ai. All rights reserved.</p>
            <p>
              Built with the PayPal Agent Toolkit and Model Context Protocol. PayPal
              and PYUSD are trademarks of PayPal, Inc.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
