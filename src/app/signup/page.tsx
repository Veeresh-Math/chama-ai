'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';
import { authClient, authErrorMessage, safeNextPath, ensureAppUser, MIN_AUTH_SPINNER_MS, wait, useRedirectIfAuthenticated } from '@/lib/auth/client';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

function SignupForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get('next');

  // Signed-in visitors don't sign up twice — take them straight inside.
  const redirecting = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your name');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    const [createResult] = await Promise.all([
      authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      }),
      // Keep the spinner visible long enough to register as motion
      wait(MIN_AUTH_SPINNER_MS),
    ]);
    const { error: authError } = createResult;

    if (authError) {
      // 422 from the auth server usually means the email already exists
      setError(
        authError.status === 422
          ? 'That email already has an account — try signing in instead.'
          : authErrorMessage(authError)
      );
      setIsLoading(false);
      return;
    }

    // Mirror the auth user into the app's users table (cookie-verifiable server-side)
    await ensureAppUser();

    // Signed up ⇒ session established ⇒ straight into the app (no
    // "sign in again" hoop), landing on the page they came from.
    const target = safeNextPath(next, '/dashboard?welcome=1');
    router.replace(target);
  };

  if (redirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
        <Logo />
        <div className="mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 ring-1 ring-black/5">
          <Spinner className="text-black" />
          <p className="text-sm text-black/60">You&apos;re already signed in — opening your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[440px]">
        <Link href="/" className="mx-auto mb-6 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="rounded-3xl border border-black/5 bg-white p-8 sm:p-10">
          <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
            Create your <span className="font-serif italic">account.</span>
          </h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
            Free until you&apos;re distributing — no card needed.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-black/60">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Amina Otieno"
                className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-black/60">
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
                className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-black/60">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[12.5px] text-black/40">
                Use 8+ characters — the copilot never sees your password.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-[#141414] text-white text-sm font-medium hover:bg-[#3d3d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white" />
                  <span>Signing you up…</span>
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-black/50">
            Already have an account?{' '}
            <Link
              href={{ pathname: '/login', query: next ? { next } : {} }}
              className="text-azure underline underline-offset-2 hover:text-black"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[13px] text-black/40">
          By continuing you agree to keep the circle&apos;s ledger honest.
        </p>
      </FadeIn>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
