'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Users,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/landing/primitives';

const links = [
  { href: '/communities', label: 'Communities', icon: Users },
  { href: '/gigs', label: 'Gig Worker Hub', icon: Wallet },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/copilot', label: 'AI Copilot', icon: Bot },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 pt-5">
      <div className="mb-7 px-2">
        <Link href="/" aria-label="Cham.ai home">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Dashboard">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium leading-[0.95] tracking-[-0.01em] transition-colors',
                active
                  ? 'bg-black/5 text-black'
                  : 'text-black/55 hover:bg-black/5 hover:text-black'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/10 pt-4 pb-6">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">
          Free plan
        </p>
        <Link
          href="/#pricing"
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium leading-[0.95] text-black/55 transition-colors hover:bg-black/5 hover:text-black"
        >
          <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Upgrade</span>
        </Link>
      </div>
    </div>
  );
}
