'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface StaggerContainerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  className?: string;
  from?: 'top' | 'left' | 'right' | 'bottom' | 'center';
}

export default function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  duration = 0.8,
  ease = 'power3.out',
  className,
  from = 'bottom',
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const childrenArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const fromVars: Record<string, unknown> = {
        opacity: 0,
        duration,
        delay,
        ease,
        stagger: {
          amount: stagger * childrenArray.filter(Boolean).length,
          from: 'start',
        },
      };

      if (from === 'bottom') {
        fromVars.y = 40;
      } else if (from === 'top') {
        fromVars.y = -40;
      } else if (from === 'left') {
        fromVars.x = -40;
      } else if (from === 'right') {
        fromVars.x = 40;
      }

      gsap.from(ref.current.children, fromVars);
    });

    return () => ctx.revert();
  }, [stagger, delay, duration, ease, from, childrenArray]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
