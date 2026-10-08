'use client';

import * as React from 'react';
import { Link } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import {
  Zap,
  Users,
  DollarSign,
  Shield,
  Briefcase,
  Brain,
  MessageSquare,
  Wallet,
  TrendingUp,
  CheckCircle,
  Settings,
  BarChart3,
} from 'lucide-react';
import { GsapProvider, ScrollReveal, StaggerContainer, FadeIn } from '@/components/animations';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function LandingPage() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const floatingAnimation = () => {
      iconRefs.current.forEach((icon, index) => {
        if (icon) {
          gsap.to(icon, {
            y: -10,
            duration: 2 + (index % 3),
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
          });
        }
      });
    };

    floatingAnimation();

    return () => {
      iconRefs.current.forEach((icon) => {
        if (icon) gsap.killTweensOf(icon);
      });
    };
  }, []);

  return (
    <GsapProvider>
      <div className="min-h-screen bg-white">
        <section className="px-6 py-24 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up" duration={1} delay={0.3} className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Build Financial Freedom Together
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                Chama.ai is an AI-powered platform that helps communities save, invest, and grow wealth collectively.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link href="/signup" className="rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:offset-2 focus-visible:outline-primary-600">
                  Get Started
                </Link>
                <Link href="/app/dashboard" className="rounded-md border border-input bg-white px-6 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:offset-2 focus-visible:outline-primary-600">
                  Learn More
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        <ScrollReveal direction="up" duration={0.8} className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              How Chama.ai Works
            </h2>
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div ref={(el) => (iconRefs.current[0] = el)} className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <Brain className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  AI-Powered Insights
                </h3>
                <p className="text-sm text-gray-600">
                  Get intelligent recommendations for your community's financial decisions.
                </p>
              </div>
              <div className="text-center">
                <div ref={(el) => (iconRefs.current[1] = el)} className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Community Savings
                </h3>
                <p className="text-sm text-gray-600">
                  Pool resources together and achieve shared financial goals.
                </p>
              </div>
              <div className="text-center">
                <div ref={(el) => (iconRefs.current[2] = el)} className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Secure Transactions
                </h3>
                <p className="text-sm text-gray-600">
                  All transactions are protected with enterprise-grade security.
                </p>
              </div>
              <div className="text-center">
                <div ref={(el) => (iconRefs.current[3] = el)} className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Wealth Growth
                </h3>
                <p className="text-sm text-gray-600">
                  Watch your community's wealth grow over time with smart investments.
                </p>
              </div>
            </StaggerContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" duration={0.8} className="bg-gray-50 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              Simple Steps to Financial Freedom
            </h2>
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 text-center">
                  Create Your Chama
                </h3>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  Start a savings group with friends, family, or colleagues.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50">
                  <Wallet className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 text-center">
                  Save Together
                </h3>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  Contribute regularly and watch your collective savings grow.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50">
                  <Briefcase className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 text-center">
                  Invest Wisely
                </h3>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  Make informed investment decisions with AI-powered insights.
                </p>
              </div>
            </StaggerContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" duration={0.8} className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-50">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sarah K.
                    </h3>
                    <p className="text-sm text-gray-500">
                      Nairobi Chamas Network
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Chama.ai has transformed how our community saves and invests together. The AI insights help us make better financial decisions."
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-50">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      James M.
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mombasa Investment Group
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The automated tracking and reporting features save us hours of work every month. We can focus on our goals instead of paperwork."
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-50">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Amina J.
                    </h3>
                    <p className="text-sm text-gray-500">
                      Kisumu Women's Collective
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "With Chama.ai, we've been able to pool our resources and invest in opportunities we couldn't access individually. Our community's wealth has grown significantly."
                </p>
              </div>
            </StaggerContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" duration={0.8} className="bg-primary-50 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Ready to Build Wealth Together?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Join thousands of communities already using Chama.ai to achieve their financial goals.
              </p>
              <Link href="/signup" className="rounded-md bg-primary-600 px-8 py-3 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:offset-2 focus-visible:outline-primary-600">
                Start Your Chama Today
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </GsapProvider>
  );
}
