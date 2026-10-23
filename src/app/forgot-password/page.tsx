'use client';

import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[440px]">
        <Link href="/" className="mx-auto mb-6 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="rounded-3xl border border-black/5 bg-white p-8 sm:p-10">
          <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
            Reset your <span className="font-serif italic">password.</span>
          </h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-black/50">
            Enter your email and we&apos;ll send a secure reset link.
          </p>

          <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-black/60"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
              />
            </div>

            <button type="submit" className="btn-dark w-full">
              Send reset link
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-black/50">
            Remember it now?{' '}
            <Link
              href="/login"
              className="text-azure underline underline-offset-2 hover:text-black"
            >
              Back to sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[13px] text-black/40">
          The link expires in 30 minutes and works only once.
        </p>
      </FadeIn>
    </div>
  );
}
