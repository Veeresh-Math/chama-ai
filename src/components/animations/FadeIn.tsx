'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  ease?: string;
  className?: string;
}

const directionMap: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 40,
  ease = 'power3.out',
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dir = directionMap[direction] || directionMap.up;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        x: dir.x * distance,
        y: dir.y * distance,
        duration,
        delay,
        ease,
      });
    });

    return () => ctx.revert();
  }, [delay, duration, direction, distance, ease]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
