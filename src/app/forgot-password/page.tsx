'use client';

import React from 'react';
import { Link } from 'next/link';
import { GsapProvider, ScrollReveal, FadeIn } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <GsapProvider>
      <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <ScrollReveal direction="right" duration={0.6} delay={0.2}>
          <FadeIn direction="up" duration={0.6} delay={0.1} className="mb-4">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </FadeIn>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Reset Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded" />
              <Link href="/forgot-password" className="w-full px-4 py-2 text-center text-white bg-red-500 rounded">
                Reset Password
              </Link>
              <Link href="/login" className="block w-full px-4 py-2 text-center text-blue-600 hover:underline">
                Remember password? Log In
              </Link>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </GsapProvider>
  );
}
