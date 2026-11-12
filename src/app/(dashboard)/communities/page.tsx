'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations';
import {
  Users, Plus, DollarSign, TrendingUp, Shield, MoreHorizontal, Brain, RefreshCw, Eye, Trash2, Edit,
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  sharePercentage: string;
  totalContributed: string;
  trustScore: number;
  isActive: boolean;
  joinedAt: string;
}

interface Community {
  id: string;
  name: string;
  description: string | null;
  monthlyContribution: string;
  currency: string;
  autoDistribute: boolean;
  trustScore: number;
  totalFunds: string;
  memberCount: number;
  members: Member[];
  contributions: Array<{ id: string; amount: string; status: string; contributedAt: string }>;
  distributions: Array<{ id: string; totalAmount: string; status: string; triggeredBy: string; createdAt: string | null; completedAt: string | null }>;
}

interface CommunityFormData {
  name: string;
  monthlyContribution: number;
  currency: string;
  description: string;
  memberEmails: string[];
  autoDistribute: boolean;
}

export default function CommunitiesPage() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [communities, setCommunities] = React.useState<Community[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    loadCommunities();
  }, []);

  const router = useRouter();

  async function loadCommunities() {
    try {
      setLoading(true);
      const res = await fetch('/api/communities', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load communities');
      const data = await res.json();
      setCommunities(data.communities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: CommunityFormData) {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          monthlyContribution: data.monthlyContribution,
          currency: data.currency,
          autoDistribute: data.autoDistribute,
          memberEmails: data.memberEmails,
        }),
      });
      if (!res.ok) throw new Error('Failed to create collective');
      const result = await res.json();
      setCommunities(prev => [result.community, ...prev]);
      setShowCreateDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collective');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-3 border-black/5 border-t-current animate-spin" />
          <p className="text-black/50">Loading collectives…</p>
        </div>
      </div>
    );
  }

  if (error && communities.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <h2 className="text-xl font-medium text-black">{error}</h2>
        <Button onClick={() => { setError(null); setLoading(true); loadCommunities(); }} className="mt-4 rounded-xl">
          Retry
        </Button>
      </div>
    );
  }

  if (communities.length === 0 && !loading && !error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center py-20">
        <Users className="h-12 w-12 text-black/10 mb-4" />
        <h3 className="text-lg font-medium text-black">No collectives yet</h3>
        <p className="text-black/50 max-w-sm mt-2">
          Create your first wealth collective to start pooling contributions, tracking trust scores, and running agentic distributions.
        </p>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="mt-6 rounded-full px-6 h-11 bg-black text-white hover:bg-black/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create First Collective
        </Button>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <span className="pointer-events-none" />
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium">New Collective</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-6 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreate({
                  name: formData.get('name') as string,
                  monthlyContribution: Number(formData.get('monthlyContribution')),
                  currency: formData.get('currency') as string,
                  description: formData.get('description') as string,
                  memberEmails: (formData.get('memberEmails') as string).split(',').map(e => e.trim()).filter(Boolean),
                  autoDistribute: formData.get('autoDistribute') === 'on',
                });
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/60">Collective Name</label>
                  <Input name="name" className="rounded-xl border-black/10" placeholder="e.g., Nairobi Tech Savings" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/60">Monthly Contribution</label>
                  <Input name="monthlyContribution" type="number" className="rounded-xl border-black/10" placeholder="100" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/60">Purpose & Vision</label>
                <Textarea name="description" className="rounded-xl border-black/10" placeholder="What is this collective saving for?" rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/60">Member Emails (comma-separated)</label>
                  <Input name="memberEmails" className="rounded-xl border-black/10" placeholder="alice@example.com, bob@example.com" required />
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-violet-900">Agentic Distribution</p>
                  <p className="text-xs text-violet-700/80">Allow the Agent Council to autonomously distribute funds based on milestones.</p>
                </div>
                <input name="autoDistribute" type="checkbox" defaultChecked className="h-5 w-5 accent-violet-600" />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
              )}
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" disabled={creating} className="rounded-xl px-6">{creating ? 'Creating…' : 'Launch Collective'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn direction="up" duration={0.5}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
              Community <span className="font-serif italic">Savings.</span>
            </h1>
            <p className="text-black/50 mt-1">Manage your wealth collectives with agent-driven trust scoring.</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={creating} className="rounded-xl px-5">
                <Plus className="h-4 w-4 mr-2" />
                {creating ? 'Creating…' : 'Create Collective'}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-medium">New Collective</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-6 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreate({
                    name: formData.get('name') as string,
                    monthlyContribution: Number(formData.get('monthlyContribution')),
                    currency: formData.get('currency') as string,
                    description: formData.get('description') as string,
                    memberEmails: (formData.get('memberEmails') as string).split(',').map(e => e.trim()).filter(Boolean),
                    autoDistribute: formData.get('autoDistribute') === 'on',
                  });
                }}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/60">Collective Name</label>
                    <Input name="name" className="rounded-xl border-black/10" placeholder="e.g., Nairobi Tech Savings" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/60">Monthly Contribution</label>
                    <Input name="monthlyContribution" type="number" className="rounded-xl border-black/10" placeholder="100" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/60">Purpose & Vision</label>
                  <Textarea name="description" className="rounded-xl border-black/10" placeholder="What is this collective saving for?" rows={3} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/60">Member Emails (comma-separated)</label>
                    <Input name="memberEmails" className="rounded-xl border-black/10" placeholder="alice@example.com, bob@example.com" required />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-violet-900">Agentic Distribution</p>
                    <p className="text-xs text-violet-700/80">Allow the Agent Council to autonomously distribute funds based on milestones.</p>
                  </div>
                  <input name="autoDistribute" type="checkbox" defaultChecked className="h-5 w-5 accent-violet-600" />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
                )}
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" disabled={creating} className="rounded-xl px-6">{creating ? 'Creating…' : 'Launch Collective'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* High-Density Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Collectives', value: communities.length, icon: Users, color: 'text-blue-600' },
          { label: 'Total Managed', value: formatCurrency(communities.reduce((sum, c) => sum + Number(c.totalFunds), 0)), icon: DollarSign, color: 'text-emerald-600' },          { label: 'Avg Trust Score', value: communities.length > 0 ? `${Math.round(communities.reduce((sum, c) => sum + c.trustScore, 0) / communities.length)}%` : '0%', icon: Shield, color: 'text-violet-600' },
          { label: 'Total Members', value: communities.reduce((sum, c) => sum + c.memberCount, 0), icon: TrendingUp, color: 'text-orange-600' },
        ].map((stat, i) => (
          <FadeIn key={i} direction="up" delay={i * 0.1} duration={0.5}>
            <div className="rounded-3xl border border-black/5 bg-white p-6 transition-all hover:border-black/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-black/50">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums text-black">{stat.value}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Collective Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-black/5 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
          <TabsTrigger value="details" className="rounded-lg px-6">Deep Dive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((community, i) => (
              <FadeIn key={community.id} direction="up" delay={i * 0.1} duration={0.5}>
                <div className="group rounded-3xl border border-black/5 bg-white overflow-hidden transition-all hover:border-black/20 shadow-sm">
                  <div className={cn('h-1.5', community.trustScore > 80 ? 'bg-emerald-500' : 'bg-amber-500')} />
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-black">{community.name}</h3>
                        <p className="text-sm text-black/50 line-clamp-1">{community.description}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full bg-black/5 font-medium">
                        Trust {community.trustScore}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-2xl bg-black/5">
                        <p className="text-lg font-medium tabular-nums text-black">{formatCurrency(Number(community.totalFunds))}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Pool</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/5">
                        <p className="text-lg font-medium tabular-nums text-black">{community.memberCount}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Members</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/5">
                        <p className="text-lg font-medium tabular-nums text-black">{formatCurrency(Number(community.monthlyContribution))}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Monthly</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <Brain className="h-3 w-3" />
                        Agentic
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"><Eye className="h-4 w-4" /> View Ledger</DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"><Edit className="h-4 w-4" /> Edit Setup</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 flex items-center gap-2 cursor-pointer"><Trash2 className="h-4 w-4" /> Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {communities.map((community) => (
            <FadeIn key={community.id} direction="up" duration={0.5}>
              <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                  <div>
                    <h3 className="text-xl font-medium text-black">{community.name}</h3>
                    <p className="text-sm text-black/50">{community.memberCount} members • {formatCurrency(Number(community.monthlyContribution))}/mo</p>
                  </div>
                  <Badge className="rounded-full bg-black text-white">Trust Score: {community.trustScore}</Badge>
                </div>
                <div className="p-6">
                  <Tabs defaultValue="members" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl bg-black/5 p-1">
                      <TabsTrigger value="members" className="rounded-lg">Members</TabsTrigger>
                      <TabsTrigger value="contributions" className="rounded-lg">Ledger</TabsTrigger>
                      <TabsTrigger value="distributions" className="rounded-lg">Payouts</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="members" className="mt-6">
                      <div className="overflow-hidden rounded-2xl border border-black/5">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-black/[0.02] text-black/40 font-medium">
                            <tr>
                              <th className="px-6 py-3">Member</th>
                              <th className="px-6 py-3 text-right">Share</th>
                              <th className="px-6 py-3 text-right">Contributed</th>
                              <th className="px-6 py-3 text-center">Trust</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {community.members.map((member) => (
                              <tr key={member.id} className="hover:bg-black/[0.01] transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-full bg-black/5">
                                      <AvatarFallback className="text-xs">{member.name?.charAt(0) ?? '?'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-black">{member.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right tabular-nums">{member.sharePercentage}%</td>
                                <td className="px-6 py-4 text-right tabular-nums font-medium">{formatCurrency(Number(member.totalContributed))}</td>
                                <td className="px-6 py-4 text-center">
                                  <Badge variant="outline" className="rounded-full">{member.trustScore}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    <TabsContent value="contributions" className="mt-6">
                      <div className="text-center py-12 text-black/40">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p>Contribution history is encrypted and managed by the Agent Council.</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="distributions" className="mt-6">
                      <div className="text-center py-12 text-black/40">
                        <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p>No active payouts in this cycle.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </FadeIn>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
