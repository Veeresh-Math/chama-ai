'use client';

import { cn } from '@/lib/utils';

export function BotAvatar({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-block h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600', className)}>
      <svg viewBox='0 0 40 40' className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <circle cx='20' cy='20' r='18' fill='none' stroke='#fff' strokeWidth={2} />
        <path d='M16 20m0-4a4 4 0 1 1 8 0a4 4 0 1 1-8 0' fill='#fff' />
        <circle cx='15' cy='17' r='1.5' fill='#fff' />
        <circle cx='25' cy='17' r='1.5' fill='#fff' />
        <path d='M20 28l4-5L20 17l-4 5z' fill='#fff' />
      </svg>
    </span>
  );
}

export default BotAvatar;
