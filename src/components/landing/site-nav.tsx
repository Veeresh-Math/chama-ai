'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './primitives';
import { authClient, useAuth } from '@/lib/auth/client';

const links = [
  { href: '#features', label: 'Product' },
  { href: '#how', label: 'How it works' },
  { href: '#security', label: 'Security' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
  const isLoggedIn = auth.status === 'authenticated';

  // Real sign-out through the auth server, then land on the marketing home
  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-[22px] z-50 flex flex-col items-center gap-2 px-4 sm:top-[30px]">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[720px] items-center justify-between gap-6 rounded-xl bg-white/90 px-4 py-3 backdrop-blur-[10px]"
      >
        <Link href="/" aria-label="Cham.ai home" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-[15px] font-medium leading-[0.95] tracking-[-0.02em] text-black/55 transition-colors hover:bg-black/5 hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-[15px] font-medium leading-[0.95] tracking-[-0.02em] text-black/55 transition-colors hover:text-black"
              >
                {auth.user?.name?.split(' ')[0] ?? 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 px-4 text-[14px] font-medium leading-[0.95] tracking-[-0.02em] text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium leading-[0.95] tracking-[-0.02em] text-black/55 transition-colors hover:text-black"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-black px-4 text-[14px] font-medium leading-[0.95] tracking-[-0.02em] text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 flex-col items-center justify-center gap-[3px] rounded-lg transition-colors hover:bg-black/5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              'block h-0.5 w-4 rounded-full bg-black transition-transform duration-300',
              open && 'translate-y-[3.5px] rotate-45'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-4 rounded-full bg-black transition-transform duration-300',
              open && '-translate-y-[3.5px] -rotate-45'
            )}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="w-full max-w-[720px] overflow-hidden rounded-[25px] bg-white/90 p-2 backdrop-blur-[10px] md:hidden"
      >
        <div className="flex flex-col">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-[15px] font-medium leading-[0.95] tracking-[-0.02em] text-black/70 transition-colors hover:bg-black/5 hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="mt-2 flex flex-col gap-2 border-t border-black/10 px-2 pt-3 pb-1">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black text-[15px] font-medium text-white"
              >
                Go to dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void handleLogout();
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 text-[15px] font-medium text-black"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 text-[15px] font-medium text-black"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black text-[15px] font-medium text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
