'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface HoverLiftProps {
  children: ReactNode;
  maxHeight?: number;
  maxWidth?: number;
  scale?: number;
  transition?: 'expand' | 'lift';
}

export default function HoverLift({
  children,
  maxHeight = 280,
  maxWidth = '100%',
  scale = 1.02,
  transition = 'expand',
}: HoverLiftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.set(ref.current, {
      scale: scale,
      transformOrigin: 'center center',
    });

    const onMouseEnter = () => {
      gsap.to(ref.current, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(ref.current, {
        scale: scale,
        duration: 0.2,
        ease: 'power2.in',
      });
    };

    ref.current.addEventListener('mouseenter', onMouseEnter);
    ref.current.addEventListener('mouseleave', onMouseLeave);

    return () => {
      ref.current.removeEventListener('mouseenter', onMouseEnter);
      ref.current.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [maxHeight, maxWidth, scale, transition]);

  return (
    <div ref={ref} style={{ maxHeight, maxWidth }} className="overflow-hidden">{children}</div>
  );
}
