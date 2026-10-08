"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromScale?: number;
  className?: string;
  id?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  fromScale = 0,
  className = "",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: fromScale },
      { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.7)" }
    );
  }, [delay, duration, fromScale]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
};

export default ScaleIn;
