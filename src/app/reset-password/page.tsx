'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';
import { authClient, authErrorMessage } from '@/lib/auth/client';
import { Spinner } from '@/components/ui/spinner';

function ResetPasswordForm() {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing or invalid. Request a new one.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords don\u2019t match');
      return;
    }

    setIsLoading(true);
    const { error: authError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (authError) {
      setError(
        authError.status === 422 || authError.status === 400
          ? 'That link has expired or was already used — request a fresh reset link.'
          : authErrorMessage(authError)
      );
      setIsLoading(false);
      return;
    }

    router.replace('/forgot-password?verified=1');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[440px]">
        <Link href="/" className="mx-auto mb-6 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="rounded-3xl border border-black/5 bg-white p-8 sm:p-10">
          {!token ? (
            <>
              <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
                Link isn&apos;t <span className="font-serif italic">valid.</span>
              </h1>
              <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
                This reset link is missing its security token. Request a fresh one — it only takes a moment.
              </p>
              <Link href="/forgot-password" className="btn-dark mt-6 inline-flex w-fit">
                Request new link
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
                Set a <span className="font-serif italic">new password.</span>
              </h1>
              <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
                Choose something you haven&apos;t used before — at least 8 characters.
              </p>

              <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="password" className="block text-[13px] font-medium text-black/60">
                    New password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-[13px] font-medium text-black/60">
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repeat it"
                    className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-dark w-full inline-flex items-center justify-center gap-2.5 disabled:opacity-50">
                  {isLoading ? (
                    <>
                      <Spinner className="text-white" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    'Set new password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
