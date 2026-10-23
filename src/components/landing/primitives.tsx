import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-lg',
          dark ? 'bg-white text-black' : 'bg-black text-white'
        )}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
          <path
            d="M17.5 6.8A6.6 6.6 0 0 0 6.3 10.4a6.6 6.6 0 0 0 11.2 3.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="8.4" cy="16.4" r="2.3" fill="currentColor" />
        </svg>
      </span>
      <span
        className={cn(
          'text-[20px] font-semibold leading-[0.95] tracking-[-0.03em]',
          dark ? 'text-white' : 'text-black'
        )}
      >
        Cham<span className={dark ? 'text-white/40' : 'text-black/40'}>.ai</span>
      </span>
    </span>
  );
}

const sectionTones = {
  light: 'bg-cream text-black',
  muted: 'bg-[#E2E2E2] text-black',
  dark: 'bg-night text-white',
} as const;

export function Section({
  id,
  tone = 'light',
  className,
  children,
}: {
  id?: string;
  tone?: keyof typeof sectionTones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn(sectionTones[tone], className)}>
      {children}
    </section>
  );
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-[60px]', className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  badge,
  title,
  lede,
  align = 'center',
  tone = 'light',
  className,
}: {
  badge?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge ? (
        <p className={cn('justify-center', dark ? 'chip-dark' : 'chip', align === 'left' && 'justify-start')}>
          {badge}
        </p>
      ) : null}
      <h2
        className={cn(
          'mt-5 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-balance sm:text-[32px]',
          dark ? 'text-white' : 'text-black'
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            'mt-4 text-base leading-[1.3] text-pretty',
            dark ? 'text-white/50' : 'text-black/50'
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

export function CtaLink({
  href,
  children,
  variant = 'primary',
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  variant?: 'primary' | 'ghost' | 'onDark';
}) {
  const styles = {
    primary: 'bg-black text-white hover:bg-black/90 focus-visible:ring-black',
    ghost: 'bg-black/5 text-black hover:bg-black/10 focus-visible:ring-black',
    onDark: 'bg-white/10 text-white hover:bg-white/[0.16] focus-visible:ring-white border border-white/15',
  }[variant];

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-[42px] items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-medium leading-[0.95] tracking-[-0.02em] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        styles,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
