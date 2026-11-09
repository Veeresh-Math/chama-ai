'use client';

import { createAuthClient } from '@neon/auth/next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const authClient = createAuthClient();

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated'; user: null };

export function useAuth(): AuthState {
  const { data, isPending } = authClient.useSession();

  if (isPending) return { status: 'loading', user: null };
  if (data?.user) {
    return {
      status: 'authenticated',
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
      },
    };
  }
  return { status: 'unauthenticated', user: null };
}

// Keep authenticated-only values in sync with the app's own `users` table.
// Server verifies the session cookie itself; no identity is sent by the browser.
export async function ensureAppUser(): Promise<void> {
  try {
    const res = await fetch('/api/users/me');
    if (!res.ok) throw new Error('upsert failed');
  } catch {
    // non-fatal: app features re-derive from email on demand
  }
}

export function authErrorMessage(error: unknown): string {
  const shape = error as { status?: number; message?: string; error?: { message?: string } } | null;
  const status = shape?.status;
  if (status === 401 || status === 403 || status === 422) {
    return shape?.message || shape?.error?.message || 'That email or password doesn\u2019t look right. Try again.';
  }
  if (typeof shape?.message === 'string' && shape.message.length > 0) return shape.message;
  return 'Something went wrong. Please try again.';
}

// Only allow same-app absolute paths as redirect targets
export function safeNextPath(next: string | null | undefined, fallback = '/dashboard'): string {
  if (!next) return fallback;
  if (!next.startsWith('/')) return fallback;
  if (next.startsWith('//')) return fallback;
  return next;
}

// Keep the button spinner on screen long enough to be perceived even when
// the auth call resolves in ~200ms on a fast connection.
export const MIN_AUTH_SPINNER_MS = 700;

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// An already-signed-in visitor should never see login/signup forms —
// drive them straight into the app and say so while it happens.
export function useRedirectIfAuthenticated(): boolean {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    authClient
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.user) {
          router.replace('/dashboard');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return checking;
}
