'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call (replace with your actual auth logic)
      console.log('Creating account with:', email, password);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // FIX: Automatically log the user in after successful signup
      localStorage.setItem('chamaai_logged_in', 'true');
      
      alert('Account created successfully! Welcome to Cham.ai.');
      window.location.href = '/'; // Redirect to home, Nav will now show "Logged In"
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[440px]">
        <Link href="/" className="mx-auto mb-6 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="rounded-3xl border border-black/5 bg-white p-8 sm:p-10">
          <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
            Start your <span className="font-serif italic">circle.</span>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-black/60"
              >
                Password
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
              <p className="mt-1.5 text-[12.5px] text-black/40">
                Use 8+ characters — the copilot never sees your password.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-dark w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-black/50">
            Already have an account?{' '}
            <Link
              href="/login"
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