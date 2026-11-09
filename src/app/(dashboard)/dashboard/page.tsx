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
  Zap,
  Play,
  FileUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  UserCheck,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/client';

interface MiroFishAgent {
  id: string;
  name: string;
  persona: string;
  avatar: string;
  needs: string[];
  satisfaction: number;
}

interface MiroFishRecommendation {
  id: string;
  title: string;
  description: string;
  agentCount: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'simulating' | 'completed';
  supportingAgents: string[];
}

// The three get-started actions, reusable in both onboarding modes.
function OnboardingSteps({ onFinish }: { onFinish: () => void }) {
  const steps = [
    { icon: Users, accent: 'text-violet-600', title: 'Create your first circle', desc: 'Name it, set the monthly amount — invite members later.', href: '/communities' },
    { icon: Cpu, accent: 'text-blue-600', title: 'Meet your AI copilot', desc: 'Ask anything — it reads your ledger and suggests next moves.', href: '/copilot' },
    { icon: Briefcase, accent: 'text-emerald-600', title: 'Post a paid gig', desc: 'Milestone escrow keeps every payment safe until delivery.', href: '/gigs' },
  ];
  return (
    <FadeIn direction="up" duration={0.5} delay={0.15}>
      <div className="mt-6 rounded-3xl bg-white p-6 border border-violet-100 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight text-black">
            Do these <span className="font-serif italic">3 things:</span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-violet-600">≈ 2 minutes</span>
            <button
              type="button"
              onClick={onFinish}
              className="text-xs font-medium text-black/50 underline underline-offset-2 hover:text-black"
            >
              Skip — open full dashboard
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.title}
                href={step.href}
                onClick={onFinish}
                className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${step.accent}`} />
                <div>
                  <p className="text-sm font-medium text-black">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-black/50">{step.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

export default function DashboardPage() {
  // Show the get-started checklist until the member finishes (or dismisses) it.
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  React.useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    if (
      localStorage.getItem('chamai_onboarding_done') === '1' &&
      url.get('welcome') !== '1'
    ) {
      setShowOnboarding(false);
    }
    setShowOnboarding(url.get('welcome') === '1');
  }, []);
  const finishOnboarding = () => {
    localStorage.setItem('chamai_onboarding_done', '1');
    setShowOnboarding(false);
  };

  const stats = [
    { label: 'Total Pool Value', value: '$48,920.00', change: '+12.4%', icon: LineChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Circles', value: '3', change: 'Stable', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Agent Trust Score', value: '98.2%', change: 'Optimized', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Pending Escrows', value: '$1,200.00', change: '2 active', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const quickLinks = [
    { title: 'Circle Management', desc: 'Manage payouts and contributions', href: '/communities', icon: Users, color: 'text-violet-600' },
    { title: 'Financial Analytics', desc: 'Track growth and yield trends', href: '/analytics', icon: LineChart, color: 'text-blue-600' },
    { title: 'AI Copilot', desc: 'Consult the Agent Council', href: '/copilot', icon: Cpu, color: 'text-violet-600' },
    { title: 'Gig Escrow', desc: 'Manage worker milestones', href: '/gigs', icon: Briefcase, color: 'text-emerald-600' },
  ];

  // MiroFish Simulation state
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationComplete, setSimulationComplete] = React.useState(false);
  const [siteUploaded, setSiteUploaded] = React.useState(false);

  // First-run detection
  const [welcomeFirstRun, setWelcomeFirstRun] = React.useState(false);
  const auth = useAuth();
  const firstName = auth.status === 'authenticated' && auth.user?.name
    ? auth.user.name.trim().split(' ')[0]
    : '';

  const [miroFishAgents] = React.useState<MiroFishAgent[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      persona: 'Working mom, 34, uses site for neighborhood childcare pooling',
      avatar: 'https://i.pravatar.cc/150?img=1',
      needs: ['SMS reminders for payments', 'calendar integration for scheduling'],
      satisfaction: 72,
    },
    {
      id: '2',
      name: 'Mike Chen',
      persona: 'Small business owner, 41, collects community funding for local shop',
      avatar: 'https://i.pravatar.cc/150?img=3',
      needs: ['invoice generator', 'tax reporting exports'],
      satisfaction: 65,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      persona: 'College student, 21, manages club event budget with peers',
      avatar: 'https://i.pravatar.cc/150?img=5',
      needs: ['split payment calculator', ' Venmo integration'],
      satisfaction: 81,
    },
    {
      id: '4',
      name: 'David Kim',
      persona: 'Retired teacher, 67, organizes neighborhood potlucks & fundraisers',
      avatar: 'https://i.pravatar.cc/150?img=8',
      needs: ['simpler mobile interface', 'email reminders instead of app notifications'],
      satisfaction: 58,
    },
  ]);

  const [miroFishRecommendations] = React.useState<MiroFishRecommendation[]>([
    {
      id: '1',
      title: 'Mobile-friendly simplified interface',
      description: 'David (67) and 2 other agents struggled with complex navigation on mobile. A simplified view would increase usage by 47%.',
      agentCount: 3,
      priority: 'high',
      status: 'completed',
      supportingAgents: ['David Kim', 'Sarah Johnson'],
    },
    {
      id: '2',
      title: 'Payment reminders (SMS/Email)',
      description: 'Sarah and Mike both mentioned missing payment deadlines because they only got in-app notifications. Multi-channel reminders critical.',
      agentCount: 2,
      priority: 'high',
      status: 'simulating',
      supportingAgents: ['Sarah Johnson', 'Mike Chen'],
    },
    {
      id: '3',
      title: 'Venmo/PayPal direct integration',
      description: 'College student Emily and 1 other agent wanted to pay directly from payment apps instead of manual transfers.',
      agentCount: 2,
      priority: 'medium',
      status: 'pending',
      supportingAgents: ['Emily Rodriguez'],
    },
  ]);

  const runMiroFishSimulation = async () => {
    if (!siteUploaded) return;
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsSimulating(false);
    setSimulationComplete(true);
  };

  const handleSiteUpload = () => {
    setSiteUploaded(true);
  };

  return (
    <div className="min-h-screen bg-cream px-6 sm:px-8 lg:px-12">
      <main className="mx-auto max-w-7xl">
        {/* Header */}
        <FadeIn direction="up" duration={0.5}>
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
                Command <span className="font-serif italic">Center.</span>
              </h1>
              <p className="mt-2 text-black/50">
                {welcomeFirstRun
                  ? "Let's set up your first circle — it takes about 2 minutes."
                  : firstName
                    ? `Welcome back, ${firstName}. Your agents are monitoring your pools.`
                    : 'Welcome back. Your agents are monitoring your pools.'}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Council Online
            </div>
          </div>
        </FadeIn>

        {/* Onboarding (first-run only) */}
        {showOnboarding && welcomeFirstRun && (
          <>
            <FadeIn direction="up" duration={0.5}>
              <div className="mt-10 rounded-3xl bg-white p-8 sm:p-12 border border-black/5">
                <h2 className="text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-black">
                  {firstName ? `Welcome, ${firstName}.` : 'Welcome.'} This is your
                  workspace — it starts <span className="font-serif italic">empty on purpose.</span>
                </h2>
                <p className="mt-2 max-w-[520px] text-[15px] leading-[1.4] text-black/50">
                  Complete the three steps below and your Command Center fills with
                  your own real data. No demo numbers, no noise.
                </p>
              </div>
            </FadeIn>
            <OnboardingSteps onFinish={finishOnboarding} />
          </>
        )}
        {showOnboarding && !welcomeFirstRun && (
          <FadeIn direction="up" duration={0.5} delay={0.1}>
            <div className="mt-6 rounded-3xl border border-violet-100 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium tracking-tight text-black">
                  Get started<span className="font-serif italic"> — 3 steps:</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-violet-600">≈ 2 minutes</span>
                  <button
                    type="button"
                    onClick={finishOnboarding}
                    aria-label="Dismiss get-started checklist"
                    className="rounded-lg p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/communities"
                  className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
                >
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                  <div>
                    <p className="text-sm font-medium text-black">1. Create your first circle</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-black/50">
                      Name it, set the monthly amount — invite members later.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/copilot"
                  className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
                >
                  <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-black">2. Meet your AI copilot</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-black/50">
                      Ask anything — it reads your ledger and suggests next moves.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/gigs"
                  className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
                >
                  <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-black">3. Post a paid gig</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-black/50">
                      Milestone escrow keeps every payment safe until delivery.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Tabs */}
        {!welcomeFirstRun && (
          <>
            <FadeIn direction="up" duration={0.5}>
              <div className="mt-12 flex gap-1 rounded-2xl bg-black/5 p-1 w-fit">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    'rounded-xl px-5 py-2 text-sm font-medium transition-all',
                    activeTab === 'overview' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'
                  )}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('user-needs')}
                  className={cn(
                    'rounded-xl px-5 py-2 text-sm font-medium transition-all',
                    activeTab === 'user-needs' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'
                  )}
                >
                  Insights Lab
                  <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                    beta
                  </span>
                </button>
              </div>
            </FadeIn>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Top Stats Bento Grid */}
                <FadeIn direction="up" duration={0.5}>
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                      <div
                        key={i}
                        className="group rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-black/10 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`rounded-xl p-2.5 sm:p-3 ${stat.bg} sm:mr-4`}>
                            <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                          </div>
                          <span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span>
                        </div>
                        <div className="mt-4 sm:mt-5">
                          <p className="text-sm font-medium text-black/50">{stat.label}</p>
                          <p className="mt-0.5 text-[1.5rem] font-medium tracking-tight text-black">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                {/* Main Navigation Grid */}
                <FadeIn direction="up" duration={0.5} delay={0.1}>
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Featured Card: AI Copilot */}
                    <Link
                      href="/copilot"
                      className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-violet-50 p-8 sm:p-10 transition-all hover:bg-violet-100/50"
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

                    {/* Other Tool Cards */}
                    {quickLinks.slice(0, 3).map((link, i) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        className="group rounded-3xl border border-black/5 bg-white p-8 sm:p-10 transition-all hover:border-black/10 hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`rounded-xl p-2 sm:p-2.5 bg-gray-50 text-black group-hover:bg-black group-hover:text-white transition-colors`}>
                            <link.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-black/20 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="mt-6 sm:mt-8 text-xl font-medium text-black">{link.title}</h3>
                        <p className="mt-2 sm:mt-3 text-sm text-black/50 leading-relaxed">{link.desc}</p>
                      </Link>
                    ))}
                  </div>
                </FadeIn>

                {/* Footer / System Status */}
                <FadeIn direction="up" duration={0.5} delay={0.2}>
                  <div className="mt-12 sm:mt-16 rounded-3xl border border-black/5 bg-white/50 p-6 sm:p-8 text-center">
                    <p className="text-sm text-black/40">
                      All transactions are settled via{' '}
                      <span className="font-medium text-black">PayPal REST API</span> and{' '}
                      <span className="font-medium text-black">PYUSD</span>. Security audited by Agent Council.
                    </p>
                  </div>
                </FadeIn>
              </>
            )}

            {/* User Needs Hub (MiroFish) Tab */}
            {activeTab === 'user-needs' && (
              <>
                <FadeIn direction="up" duration={0.5}>
                  <div className="mt-10 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/40">
                        <Brain className="h-3 w-3 text-violet-600" />
                        MiroFish Simulation Engine
                      </div>
                      <h2 className="mt-2 text-xl font-medium tracking-tight text-black">
                        Real-user agents already <span className="font-serif italic text-black/70">tested your platform.</span>
                      </h2>
                      <p className="mt-1 text-sm text-black/50 max-w-lg leading-relaxed">
                        {miroFishAgents.length} simulated personas matched to your real member base surfaced {miroFishRecommendations.length} high-impact needs.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSiteUpload}
                        disabled={siteUploaded}
                        className="rounded-full px-5 h-11 border-black/10"
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        {siteUploaded ? 'Latest Build Indexed' : 'Re-index Build'}
                      </Button>
                      <Button
                        onClick={runMiroFishSimulation}
                        disabled={!siteUploaded || isSimulating}
                        className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90"
                      >
                        {isSimulating ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-pulse" />
                            Simulating…
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            {simulationComplete ? 'Re-run Simulation' : 'Run Simulation'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn direction="up" duration={0.5} delay={0.1}>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {miroFishAgents.map((agent) => (
                      <div key={agent.id} className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-black/10 hover:shadow-md h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-black truncate">{agent.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                              Satisfaction {agent.satisfaction}%
                            </p>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-black/50 leading-relaxed flex-1">
                          {agent.persona}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {agent.needs.map((need) => (
                            <span key={need} className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-black/60">
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                <FadeIn direction="up" duration={0.5} delay={0.2}>
                  <div className="mt-10 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 text-violet-700 mb-4">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-wider">Recommended Next Builds</span>
                    </div>
                    <div className="space-y-3">
                      {miroFishRecommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 transition-all hover:bg-violet-100/50"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-violet-900">{rec.title}</p>
                              <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">
                                {rec.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-violet-700/80 mt-1 leading-relaxed">
                              {rec.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                              {rec.agentCount} agents
                            </span>
                            <Badge
                              className={cn(
                                'rounded-full text-[10px] font-bold uppercase tracking-wider border-0',
                                rec.priority === 'high' ? 'bg-red-500 text-white' : rec.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-black/10 text-black'
                              )}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
