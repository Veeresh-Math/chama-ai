"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromY?: number;
  className?: string;
  id?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  fromY = 40,
  className = "",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
    );
  }, [delay, duration, fromY]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
};

export default FadeInUp;
