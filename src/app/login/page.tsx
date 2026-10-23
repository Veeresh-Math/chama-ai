'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/animations';
import { Logo } from '@/components/landing/primitives';

// TasteSkill improvements applied:
// - Flat surfaces, no excessive rounding
// - Proper type scale with clear hierarchy
// - Equal, tight margins
// - Clear labels, no "eyebrow" ambiguity
// - Proper spacing that avoids empty stretches
// - Honest error states
// - Focused, single-purpose form with clear action

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      console.log('Logging in with:', email, password);
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('chamaai_logged_in', 'true');
      alert('Login successful! Welcome back.');
      window.location.href = '/';
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f8] px-4 py-8">
      <FadeIn direction="up" duration={0.6} delay={0.05} className="w-full max-w-[400px]">
        <Link href="/" className="mx-auto mb-8 flex w-fit justify-center">
          <Logo />
        </Link>

        {/* TasteSkill: Flat surfaces with minimal border, subtle radius only for cards */}
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
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#6b6b6b] mb-2"
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
                className="h-9 w-full border border-[#d4d4d4] bg-white px-3 text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-[#0a0a0a]/30 focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#6b6b6b]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1d5fbf] hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-9 w-full border border-[#d4d4d4] bg-white px-3 text-sm text-[#0a0a0a] outline-none transition-colors placeholder:text-[#0a0a0a]/30 focus:border-[#0a0a0a]"
              />
            </div>

            {/* TasteSkill: Primary button is neutral, no brand color - focus on action */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-9 bg-[#141414] text-white text-sm font-medium hover:bg-[#3d3d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6b6b6b]">
            New here?{' '}
            <Link
              href="/signup"
              className="text-[#1d5fbf] hover:underline underline-offset-2"
            >
              Create an account
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