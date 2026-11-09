'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';
import { authClient, authErrorMessage } from '@/lib/auth/client';
import { Spinner } from '@/components/ui/spinner';

function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = React.useState('');
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setStatus('sending');
    const { error: authError } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: '/reset-password', // kept on our own pages
    });

    if (authError) {
      setError(authErrorMessage(authError));
      setStatus('error');
      return;
    }
    setStatus('sent');
  };

  // ?verified=1 arrives after the user completes the reset link
  if (searchParams.get('verified') === '1') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
        <FadeIn direction="up" duration={0.6} className="w-full max-w-[440px]">
          <Link href="/" className="mx-auto mb-6 flex w-fit justify-center">
            <Logo />
          </Link>
          <div className="rounded-3xl border border-black/5 bg-white p-8 sm:p-10 text-center">
            <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
              Password <span className="font-serif italic">updated.</span>
            </h1>
            <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
              Your new password is set. Sign in to continue where you left off.
            </p>
            <Link href="/login" className="btn-dark mt-6 inline-flex w-fit">
              Sign in
            </Link>
          </div>
        </FadeIn>
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
          {status === 'sent' ? (
            <>
              <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
                Check your <span className="font-serif italic">inbox.</span>
              </h1>
              <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
                If an account exists for <span className="font-medium text-black/80">{email}</span>, a
                reset link is on its way. It expires in 30 minutes and works only once.
              </p>
              <p className="mt-6 text-center text-[14px] text-black/50">
                Remembered it?{' '}
                <Link href="/login" className="text-azure underline underline-offset-2 hover:text-black">
                  Back to sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
                Reset your <span className="font-serif italic">password.</span>
              </h1>
              <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
                Enter your email and we&apos;ll send a secure reset link.
              </p>

              <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
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

                <button type="submit" disabled={status === 'sending'} className="btn-dark w-full inline-flex items-center justify-center gap-2.5 disabled:opacity-50">
                  {status === 'sending' ? (
                    <>
                      <Spinner className="text-white" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[14px] text-black/50">
                Remember it now?{' '}
                <Link href="/login" className="text-azure underline underline-offset-2 hover:text-black">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
