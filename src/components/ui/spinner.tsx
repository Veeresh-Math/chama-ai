import * as React from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' } as const;
  return (
    <svg
      className={cn('animate-spin', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Spinner;
