'use client';

import * as React from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

// ============================================
// DESIGN TOKENS — unified across landing + dashboard
// ============================================

export const COLORS = {
  cream: '#EAEAEA',
  night: '#151515',
  black: '#0f0f0f',
  white: '#ffffff',
  azure: '#0099ff',
  emerald: '#10b981',
  violet: '#6d28d9',
  orange: '#f59e0b',
  gray: '#6b7280',
  border: '#e5e5e5',
} as const;

export const RADIUS = '12px';
export const SHADOW = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
export const SHADOW_HOVER =
  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';

// ============================================
// GSAP HOVER CARD — reusable animated card wrapper
// ============================================

interface GsapCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  lift?: number;
  onClick?: () => void;
}

export function GsapCard({
  children,
  className = '',
  hoverScale = 1.02,
  lift = -4,
  onClick,
}: GsapCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const card = ref.current;
    gsap.set(card, { y: 0, scale: 1, transformOrigin: 'center center' });

    const onEnter = () => {
      gsap.to(card, {
        y: lift,
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
        boxShadow: SHADOW_HOVER,
      });
    };

    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.in',
        boxShadow: SHADOW,
      });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [hoverScale, lift]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        className,
      )}
      style={{ boxShadow: SHADOW }}
    >
      {children}
    </div>
  );
}

// ============================================
// STAT CARD — consistent metric display
// ============================================

interface StatCardProps {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ElementType;
  colorClass: string;
  bg: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary';
}

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  colorClass,
  bg,
  badgeText,
  badgeVariant,
}: StatCardProps) {
  return (
    <GsapCard
      className={cn(
        'flex flex-col rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm',
        'transition-all duration-300 hover:border-black/20 hover:shadow-xl hover:-translate-y-1',
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        {badgeText && (
          <Badge variant={badgeVariant} className="text-xs">
            {badgeText}
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-black/50">{label}</p>
      <p className="mt-1 text-2xl font-medium tracking-tight text-black">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-black/40">{sublabel}</p>
    </GsapCard>
  );
}

// ============================================
// ACTION CARD — clickable action with icon
// ============================================

interface ActionCardProps {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}

export function ActionCard({
  title,
  desc,
  href,
  icon: Icon,
  color,
  onClick,
}: ActionCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
    else if (href) window.location.href = href;
  };

  return (
    <GsapCard
      className={cn(
        'flex flex-col rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm cursor-pointer',
        'hover:border-black/20 hover:shadow-xl',
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.replace('text', 'bg')}`}>
          <Icon className="h-5 w-5" />
        </div>
        <svg
          className="h-4 w-4 text-black/20 group-hover:text-black transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l7-7-7-7"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-black mb-2 group-hover:text-black/80 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-black/50 leading-relaxed">{desc}</p>
    </GsapCard>
  );
}

// ============================================
// PAGE SHELL — consistent wrapper for dashboard pages
// ============================================

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageShell({
  children,
  title,
  subtitle,
  badge,
}: PageShellProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-black/50">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs font-medium text-white tracking-tighter',
          )}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================
// SECTION CARD — grouped content card
// ============================================

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-black/5 bg-white shadow-sm',
        className,
      )}
    >
      <div className="p-6 sm:p-8 border-b border-black/5">
        <h2 className="text-sm font-medium tracking-tight text-black">
          {title}
        </h2>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
