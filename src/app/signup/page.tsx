'use client';

import React from 'react';
import { Link } from 'next/link';
import { GsapProvider, ScrollReveal, FadeIn, HoverLift } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <GsapProvider>
      <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollReveal direction="up" duration={0.6} delay={0.2}>
                <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" />
              </ScrollReveal>
              <ScrollReveal direction="up" duration={0.6} delay={0.3}>
                <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" />
              </ScrollReveal>
              <ScrollReveal direction="up" duration={0.6} delay={0.4}>
                <HoverLift transition="lift" scale={1.02}>
                  <Link href="/signup" className="block w-full px-4 py-2 text-center text-white bg-blue-500 rounded">
                    Sign Up
                  </Link>
                </HoverLift>
              </ScrollReveal>
              <ScrollReveal direction="up" duration={0.6} delay={0.5}>
                <Link href="/login" className="block w-full px-4 py-2 text-center text-blue-600 hover:underline">
                  Already have an account? Log In
                </Link>
              </ScrollReveal>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </GsapProvider>
  );
}
