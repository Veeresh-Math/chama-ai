'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  LineChart, 
  Cpu, 
  Briefcase, 
  ArrowUpRight, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FadeIn } from '@/components/animations';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Pool Value', value: '$48,920.00', change: '+12.4%', icon: LineChart, color: 'text-emerald-600' },
    { label: 'Active Circles', value: '3', change: 'Stable', icon: Users, color: 'text-blue-600' },
    { label: 'Agent Trust Score', value: '98.2%', change: 'Optimized', icon: ShieldCheck, color: 'text-violet-600' },
    { label: 'Pending Escrows', value: '$1,200.00', change: '2 active', icon: Briefcase, color: 'text-orange-600' },
  ];

  const quickLinks = [
    { title: 'Circle Management', desc: 'Manage payouts and contributions', href: '/communities', icon: Users },
    { title: 'Financial Analytics', desc: 'Track growth and yield trends', href: '/analytics', icon: LineChart },
    { title: 'AI Copilot', desc: 'Consult the Agent Council', href: '/copilot', icon: Cpu },
    { title: 'Gig Escrow', desc: 'Manage worker milestones', href: '/gigs', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-cream px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <FadeIn direction="up" duration={0.5}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
                Command <span className="font-serif italic">Center.</span>
              </h1>
              <p className="mt-1 text-black/50">Welcome back. Your agents are monitoring 3 active pools.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Council Online
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Top Stats Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={i} direction="up" delay={i * 0.1} duration={0.5}>
              <div className="group rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:border-black/10 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2 ${stat.color.replace('text', 'bg')}/10`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-black/50">{stat.label}</p>
                  <p className="text-2xl font-medium tracking-tight text-black">{stat.value}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Main Navigation Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured Card: AI Copilot */}
          <FadeIn direction="up" delay={0.4} duration={0.5}>
            <Link 
              href="/copilot" 
              className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-violet-50 p-8 transition-all hover:bg-violet-100/50"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-violet-700">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Priority Access</span>
                </div>
                <h3 className="mt-4 text-2xl font-medium text-violet-900">Consult the Council</h3>
                <p className="mt-2 text-violet-700/80">Execute complex money movements using multi-agent consensus.</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-700">
                  Launch Terminal <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              <Cpu className="absolute -bottom-6 -right-6 h-32 w-32 text-violet-200/50 transition-transform group-hover:scale-110" />
            </Link>
          </FadeIn>

          {/* Other Tool Cards */}
          {quickLinks.slice(0, 3).map((link, i) => (
            <FadeIn key={i} direction="up" delay={0.5 + (i * 0.1)} duration={0.5}>
              <Link 
                href={link.href} 
                className="group rounded-3xl border border-black/5 bg-white p-8 transition-all hover:border-black/10 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-gray-50 p-2 text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-black/20 group-hover:text-black transition-colors" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-black">{link.title}</h3>
                <p className="mt-2 text-sm text-black/50 leading-relaxed">{link.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Footer / System Status */}
        <FadeIn direction="up" delay={0.8} duration={0.5}>
          <div className="mt-12 rounded-3xl border border-black/5 bg-white/50 p-6 text-center">
            <p className="text-sm text-black/40">
              All transactions are settled via <span className="font-medium text-black">PayPal REST API</span> and <span className="font-medium text-black">PYUSD</span>. 
              Security audited by Agent Council.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
