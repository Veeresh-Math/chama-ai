'use client';

import { useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GsapProviderProps {
  children: ReactNode;
}

export default function GsapProvider({ children }: GsapProviderProps) {
  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== 'undefined') {
      const { ScrollTrigger } = require('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  return <>{children}</>;
}

export { gsap };
