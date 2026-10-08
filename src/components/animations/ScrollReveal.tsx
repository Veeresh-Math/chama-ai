'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  className?: string;
  scrub?: boolean;
  once?: boolean;
}

const directionMap: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export default function ScrollReveal({
  children,
  direction = 'up',
  distance = 50,
  duration = 0.8,
  delay = 0,
  ease = 'power3.out',
  className,
  scrub = false,
  once = true,
}: ScrollRevealProps) {
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
        scrollTrigger: {
          trigger: ref.current,
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          scrub: scrub ? 0.5 : false,
        },
      });
    });

    return () => ctx.revert();
  }, [direction, distance, duration, delay, ease, scrub, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
