"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SlideInRightProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromX?: number;
  className?: string;
  id?: string;
}

export const SlideInRight: React.FC<SlideInRightProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  fromX = 80,
  className = "",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: fromX },
      { opacity: 1, x: 0, duration, delay, ease: "power3.out" }
    );
  }, [delay, duration, fromX]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
};

export default SlideInRight;
