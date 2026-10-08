"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface StaggerChildrenProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  id?: string;
}

export const StaggerChildren: React.FC<StaggerChildrenProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  stagger = 0.15,
  className = "",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => ref.current);
    gsap.fromTo(
      ref.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
      }
    );
    return () => ctx.revert();
  }, [delay, duration, stagger]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
};

export default StaggerChildren;
