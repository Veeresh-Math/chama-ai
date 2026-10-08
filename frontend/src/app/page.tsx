"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  CreditCard,
  Sparkles,
  TrendingUp,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-trust",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        );

      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const stats = [
    { value: "50K+", label: "Active Communities" },
    { value: "$2.5M+", label: "Total Volume" },
    { value: "98%", label: "Trust Score" },
    { value: "24/7", label: "Support Available" },
  ];

  const features = [
    {
      icon: Users,
      title: "Trust Circles",
      description:
        "Build savings communities with built-in reputation scoring and automated distributions.",
    },
    {
      icon: Shield,
      title: "Secure Escrow",
      description:
        "Milestone-based contracts with multisig releases and dispute resolution.",
    },
    {
      icon: CreditCard,
      title: "Instant Payouts",
      description:
        "Real-time settlements with multiple payment rails and currency support.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Cross-border communities with localized compliance and currency handling.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description:
        "End-to-end encryption, hardware wallet support, and audit trails.",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description:
        "Real-time insights into community health, cash flow, and member activity.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white" ref={heroRef}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-sm border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-paypalBlue to-electricViolet rounded-2xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">PayPal AI Hub</span>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-paypalBlue to-electricViolet rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <section className="min-h-[90vh] flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="hero-title mb-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                Agentic Commerce
                <br />
                <span className="bg-gradient-to-r from-paypalBlue to-electricViolet bg-clip-text text-transparent">
                  for Everyone
                </span>
              </h1>
            </div>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Build trust-based savings circles, deploy smart escrow contracts, and
              automate financial workflows with AI-powered copilots.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-paypalBlue to-electricViolet rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-paypalBlue/25"
              >
                Start Building Free
                <ArrowRight size={20} className="inline-block ml-2" />
              </button>
              <Link
                href="/login"
                className="w-full sm:w-auto px-10 py-4 border border-white/20 rounded-2xl font-semibold text-lg text-gray-300 hover:text-white hover:border-white/40 transition-all"
              >
                Watch Demo
              </Link>
            </div>
            <div className="hero-trust flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        <section ref={statsRef} className="py-24 px-6 bg-white/5 border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center p-6">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-paypalBlue to-electricViolet bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={featuresRef} className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-paypalBlue to-electricViolet bg-clip-text text-transparent">
                  build trust
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Powerful tools for community finance, gig economy, and AI-assisted
                money management.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card glass-card p-8 hover:border-paypalBlue/50 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-paypalBlue/20 to-electricViolet/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={28} className="text-paypalBlue" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={ctaRef} className="py-24 px-6 bg-gradient-to-br from-paypalBlue/10 via-transparent to-electricViolet/10">
          <div className="max-w-4xl mx-auto text-center cta-content">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-2 mb-6">
              <Sparkles size={16} className="text-paypalBlue" />
              <span className="text-sm font-medium text-gray-300">New: AI Financial Copilot</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your{" "}
              <span className="bg-gradient-to-r from-paypalBlue to-electricViolet bg-clip-text text-transparent">
                financial workflows
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of communities and freelancers already using PayPal AI
              Hub to automate trust, payments, and growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-paypalBlue to-electricViolet rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-paypalBlue/25"
              >
                Create Free Account
                <ArrowRight size={20} className="inline-block ml-2" />
              </button>
              <Link
                href="/login"
                className="w-full sm:w-auto px-10 py-4 border border-white/20 rounded-2xl font-semibold text-lg text-gray-300 hover:text-white hover:border-white/40 transition-all"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-paypalBlue to-electricViolet rounded-xl flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg">PayPal AI Hub</span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of agentic commerce. Build trust, automate payments,
                grow together.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Trust Circles</li>
                <li>Smart Escrow</li>
                <li>AI Copilot</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About</li>
                <li>Careers</li>
                <li>Security</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2024 PayPal AI Hub. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
