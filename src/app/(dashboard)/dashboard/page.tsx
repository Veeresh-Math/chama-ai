'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Cpu,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  Play,
  FileUp,
  Brain,
  Sparkles,
  X,
} from 'lucide-react';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth/client';
import {
  PageShell,
  StatCard,
  ActionCard,
  GsapCard,
  SectionCard,
  COLORS,
} from '@/components/design-system';

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

function OnboardingSteps({ onFinish }: { onFinish: () => void }) {
  const steps = [
    { icon: Users, accent: 'text-violet-600', title: 'Create your first circle', desc: 'Name it, set the monthly amount — invite members later.', href: '/communities' },
    { icon: Cpu, accent: 'text-blue-600', title: 'Meet your AI copilot', desc: 'Ask anything — it reads your ledger and suggests next moves.', href: '/copilot' },
    { icon: Briefcase, accent: 'text-emerald-600', title: 'Post a paid gig', desc: 'Milestone escrow keeps every payment safe until delivery.', href: '/gigs' },
  ];
  return (
    <FadeIn direction="up" duration={0.5} delay={0.15}>
      <GsapCard className="bg-white p-6 border border-violet-100 sm:p-8">
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
      </GsapCard>
    </FadeIn>
  );
}

export default function DashboardPage() {
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

  const auth = useAuth();
  const firstName = auth.status === 'authenticated' && auth.user?.name
    ? auth.user.name.trim().split(' ')[0]
    : '';

  const stats = [
    { label: 'Total Pool Value', value: '$48,920.00', change: '+12.4%', icon: LineChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Circles', value: '3', change: 'Stable', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Agent Trust Score', value: '98.2%', change: 'Optimized', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Pending Escrows', value: '$1,200.00', change: '2 active', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const actions = [
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

  const [welcomeFirstRun, setWelcomeFirstRun] = React.useState(false);

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
      description: 'David (67) and 2 other agents struggled with complex navigation on mobile.',
      agentCount: 3,
      priority: 'high',
      status: 'completed',
      supportingAgents: ['David Kim', 'Sarah Johnson'],
    },
    {
      id: '2',
      title: 'Payment reminders (SMS/Email)',
      description: 'Sarah and Mike mentioned missing payment deadlines. Multi-channel reminders critical.',
      agentCount: 2,
      priority: 'high',
      status: 'simulating',
      supportingAgents: ['Sarah Johnson', 'Mike Chen'],
    },
    {
      id: '3',
      title: 'Venmo/PayPal direct integration',
      description: 'Emily wanted to pay directly from payment apps instead of manual transfers.',
      agentCount: 2,
      priority: 'medium',
      status: 'pending',
      supportingAgents: ['Emily Rodriguez'],
    },
  ]);

  const runMiroFishSimulation = async () => {
    if (!siteUploaded) return;
    setIsSimulating(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsSimulating(false);
    setSimulationComplete(true);
  };

  const handleSiteUpload = () => {
    setSiteUploaded(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Onboarding overlay (first-run only) */}
      {showOnboarding && welcomeFirstRun && (
        <div className="fixed inset-0 z-50 bg-cream flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-12 border border-black/5 shadow-xl">
            <h2 className="text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-black mb-2">
              {firstName ? `Welcome, ${firstName}.` : 'Welcome.'} This is your workspace.
            </h2>
            <p className="mt-2 max-w-[520px] text-[15px] leading-[1.4] text-black/50">
              Complete the three steps below and your Command Center fills with your own real data.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Link
                href="/communities"
                onClick={finishOnboarding}
                className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
              >
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                <div>
                  <p className="text-sm font-medium text-black">Create your first circle</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-black/50">Name it, set the monthly amount — invite members later.</p>
                </div>
              </Link>
              <Link
                href="/copilot"
                onClick={finishOnboarding}
                className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
              >
                <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-black">Meet your AI copilot</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-black/50">Ask anything — it reads your ledger and suggests next moves.</p>
                </div>
              </Link>
              <Link
                href="/gigs"
                onClick={finishOnboarding}
                className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-cream p-4 transition-colors hover:border-black/10 hover:bg-black/5"
              >
                <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-black">Post a paid gig</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-black/50">Milestone escrow keeps every payment safe until delivery.</p>
                </div>
              </Link>
            </div>
            <button
              onClick={finishOnboarding}
              className="mt-6 flex w-full items-center justify-center rounded-lg p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <FadeIn direction="up" duration={0.5}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Stats Bento Grid */}
        <FadeIn direction="up" duration={0.5} className="gsap-fade-up">
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard
                key={i}
                label={stat.label}
                value={stat.value}
                sublabel={stat.change}
                icon={stat.icon}
                colorClass={stat.color}
                bg={stat.bg}
              />
            ))}
          </div>
        </FadeIn>

        {/* Actions Grid */}
        <FadeIn direction="up" duration={0.5} delay={0.1} className="gsap-fade-up">
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, i) => (
              <ActionCard
                key={i}
                title={action.title}
                desc={action.desc}
                href={action.href}
                icon={action.icon}
                color={action.color}
              />
            ))}
          </div>
        </FadeIn>

        {/* System Status */}
        <FadeIn direction="up" duration={0.5} delay={0.2} className="gsap-fade-up">
          <GsapCard className="mt-10 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 text-center shadow-sm">
            <p className="text-sm text-black/40">
              All transactions are settled via{' '}
              <span className="font-medium text-black">PayPal REST API</span> and{' '}
              <span className="font-medium text-black">PYUSD</span>. Security audited by Agent Council.
            </p>
          </GsapCard>
        </FadeIn>

        {/* User Needs Hub (MiroFish) */}
        {activeTab === 'user-needs' && (
          <>
            <FadeIn direction="up" duration={0.5}>
              <SectionCard title="MiroFish Simulation Engine">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                      {siteUploaded ? 'Latest Build Indexed' : 'Re-index Latest Build'}
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
                          {simulationComplete ? 'Re-run MiroFish Simulation' : 'Run MiroFish Simulation'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </FadeIn>

            <FadeIn direction="up" duration={0.5} delay={0.1}>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {miroFishAgents.map((agent) => (
                  <GsapCard key={agent.id} className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-10 w-10 shrink-0">
                        <Image
                          src={agent.avatar}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          fill={false}
                          priority={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
                          {agent.name.charAt(0)}
                        </div>
                      </div>
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
                        <span
                          key={need}
                          className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-black/60"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </GsapCard>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={0.5} delay={0.2}>
              <SectionCard title="Recommended Next Builds">
                <div className="space-y-3">
                  {miroFishRecommendations.map((rec) => (
                    <GsapCard key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
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
                            rec.priority === 'high' ? 'bg-red-500 text-white' : rec.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-black/10 text-black',
                          )}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                    </GsapCard>
                  ))}
                </div>
              </SectionCard>
            </FadeIn>
          </>
        )}
      </main>
    </div>
  );
}
