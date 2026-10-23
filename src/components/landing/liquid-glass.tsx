'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type LiquidGLInstance = {
  destroy(): void;
  setTint(color: string | null): void;
  setDraggable(value: boolean): void;
};

type Props = {
  className?: string;
  snapshot: string;
  tint?: string | null;
  frost?: number;
  zIndex?: number;
  delayMs?: number;
  refraction?: number;
  children: React.ReactNode;
};

export default function LiquidGlass({
  className,
  snapshot,
  tint = null,
  frost = 0,
  zIndex = 3,
  delayMs = 1200,
  refraction = 0.012,
  children,
}: Props) {
  const id = React.useId().replace(/:/g, '');
  const paneId = `liquid-pane-${id}`;
  const instanceRef = React.useRef<LiquidGLInstance | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const mod = await import('liquid-gl');
        if (cancelled) return;
        const liquidGL = mod.default;

        timer = setTimeout(async () => {
          if (cancelled || instanceRef.current) return;

          const target = document.getElementById(paneId);
          const snap = document.querySelector(snapshot);

          // CRITICAL FIX: Verify element exists, is visible, and has dimensions
          if (!target || !snap) {
            console.warn('[liquidGL] Target or snapshot missing, skipping effect');
            return;
          }

          const rect = snap.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            console.warn('[liquidGL] Snapshot element has no size, skipping effect');
            return;
          }

          try {
            // Use requestAnimationFrame to ensure the DOM is painted before snapshotting
            requestAnimationFrame(() => {
              if (cancelled) return;
              instanceRef.current = liquidGL({
                engine: 'auto',
                snapshot,
                target: `#${paneId}`,
                resolution: 1.5,
                zIndex,
                refraction,
                aberration: 0.015,
                bevelDepth: 0.08,
                bevelWidth: 0.15,
                frost,
                shadow: true,
                specular: true,
                reveal: 'fade',
                tint,
              });
            });
          } catch (err) {
            console.warn('[liquidGL] init failed, keeping CSS fallback', err);
          }
        }, delayMs);
      } catch (err) {
        console.warn('[liquidGL] module load failed', err);
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [paneId, snapshot, tint, frost, zIndex, delayMs, refraction]);

  return (
    <div
        id={paneId}
        className={cn('relative bg-white rounded-3xl shadow-2xl', className)}
        style={{ zIndex }}
      >
      {children}
    </div>
  );
}