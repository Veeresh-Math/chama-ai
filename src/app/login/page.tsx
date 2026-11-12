'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';
import { authClient, authErrorMessage, safeNextPath, ensureAppUser, MIN_AUTH_SPINNER_MS, wait, useRedirectIfAuthenticated } from '@/lib/auth/client';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get('next');

  const redirecting = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    const [signInResult] = await Promise.all([
      authClient.signIn.email({
        email: email.trim(),
        password,
      }),
      // Keep the spinner visible long enough to register as motion
      wait(MIN_AUTH_SPINNER_MS),
    ]);
    const { error: authError } = signInResult;

    if (authError) {
      setError(
        authError.status === 401 || authError.status === 422
          ? 'That email or password doesn\u2019t look right. Try again.'
          : authErrorMessage(authError)
      );
      setIsLoading(false);
      return;
    }

    // Mirror the auth user into the app's users table (cookie-verifiable server-side)
    await ensureAppUser();

    // Sign in always returns you to where you were headed (or the app home),
    // never back to the marketing site.
    router.replace(safeNextPath(next));
  };

  if (redirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f8] px-4 py-8">
        <Logo />
        <div className="mt-8 flex items-center gap-3 border border-[#e6e6e6] bg-white px-5 py-3">
          <Spinner className="text-[#0a0a0a]" />
          <p className="text-sm text-[#6b6b6b]">You&apos;re already signed in — opening your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f8] px-4 py-8">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[400px]">
        <Link href="/" className="mx-auto mb-8 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="border border-[#e6e6e6] bg-white p-8">
          <h1 className="text-2xl font-medium leading-tight tracking-[-0.01em] text-[#0a0a0a]">
            Welcome <span className="font-serif italic">back.</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
            Sign in to your circle&apos;s workspace.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-[#ffedea] border border-[#831c1e]/20 text-[#831c1e] text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#6b6b6b] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="h-9 w-full border border-[#d4d4d4] bg-white px-3 text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-[#0a0a0a]/30 focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-medium text-[#6b6b6b]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1d5fbf] hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-9 w-full border border-[#d4d4d4] bg-white px-3 text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-[#0a0a0a]/30 focus:border-[#0a0a0a] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a0a0a]/40 hover:text-[#0a0a0a]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-[#141414] text-white text-sm font-medium hover:bg-[#3d3d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white" />
                  <span>Signing you in…</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6b6b6b]">
            New to Cham.ai?{' '}
            <Link
              href={{ pathname: '/signup', query: next ? { next } : {} }}
              className="text-[#1d5fbf] hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#6b6b6b]">
          Cham.ai — the AI-powered wealth collective.
        </p>
      </FadeIn>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
