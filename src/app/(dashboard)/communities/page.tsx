'use client';

import * as React from 'react';
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
  Users,
  Plus,
  DollarSign,
  TrendingUp,
  Shield,
  MoreHorizontal,
  Brain,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
} from 'lucide-react';

const mockCommunities = [
  {
    id: '1',
    name: 'Nairobi Tech Savings',
    description: 'Monthly savings for software developers',
    monthlyContribution: 100,
    trustScore: 87,
    totalFunds: 2400,
    memberCount: 12,
    members: [
      { id: '1', name: 'Alice W.', sharePercentage: 8.33, totalContributed: 1200, trustScore: 92 },
      { id: '2', name: 'Bob M.', sharePercentage: 8.33, totalContributed: 1100, trustScore: 88 },
      { id: '3', name: 'Carol K.', sharePercentage: 8.33, totalContributed: 1000, trustScore: 85 },
    ],
    contributions: [
      { id: '1', amount: 100, status: 'completed', createdAt: new Date('2024-10-01') },
    ],
    distributions: [
      { id: '1', totalAmount: 500, status: 'completed', createdAt: new Date('2024-08-15'), triggeredBy: 'auto' },
    ],
  },
  {
    id: '2',
    name: 'Women Entrepreneurs Circle',
    description: 'Supporting women-led businesses',
    monthlyContribution: 50,
    trustScore: 92,
    totalFunds: 800,
    memberCount: 8,
    members: [
      { id: '4', name: 'Diana R.', sharePercentage: 12.5, totalContributed: 600, trustScore: 95 },
      { id: '5', name: 'Eve L.', sharePercentage: 12.5, totalContributed: 550, trustScore: 90 },
    ],
    contributions: [],
    distributions: [],
  },
];

export default function CommunitiesPage() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

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
              <Button className="rounded-xl px-5">
                <Plus className="h-4 w-4 mr-2" />
                Create Collective
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-medium">New Collective</DialogTitle>
              </DialogHeader>
              <form className="space-y-6 py-4">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/60">Collective Name</label>
                    <Input className="rounded-xl border-black/10" placeholder="e.g., Nairobi Tech Savings" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/60">Monthly Contribution</label>
                    <Input type="number" className="rounded-xl border-black/10" placeholder="100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/60">Purpose & Vision</label>
                  <Textarea className="rounded-xl border-black/10" placeholder="What is this collective saving for?" rows={3} />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-violet-900">Agentic Distribution</p>
                    <p className="text-xs text-violet-700/80">Allow the Agent Council to autonomously distribute funds based on milestones.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-violet-600" />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-xl">Cancel</Button>
                  <Button className="rounded-xl px-6">Launch Collective</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* High-Density Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Collectives', value: mockCommunities.length, icon: Users, color: 'text-blue-600' },
          { label: 'Total Managed', value: formatCurrency(mockCommunities.reduce((sum, c) => sum + c.totalFunds, 0)), icon: DollarSign, color: 'text-emerald-600' },
          { label: 'Avg Trust Score', value: `${Math.round(mockCommunities.reduce((sum, c) => sum + c.trustScore, 0) / mockCommunities.length)}%`, icon: Shield, color: 'text-violet-600' },
          { label: 'Total Members', value: mockCommunities.reduce((sum, c) => sum + c.memberCount, 0), icon: TrendingUp, color: 'text-orange-600' },
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
      </div >

      {/* Collective Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-black/5 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
          <TabsTrigger value="details" className="rounded-lg px-6">Deep Dive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCommunities.map((community, i) => (
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
                        <p className="text-lg font-medium tabular-nums text-black">{formatCurrency(community.totalFunds)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Pool</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/5">
                        <p className="text-lg font-medium tabular-nums text-black">{community.memberCount}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Members</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/5">
                        <p className="text-lg font-medium tabular-nums text-black">{formatCurrency(community.monthlyContribution)}</p>
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
          {mockCommunities.map((community) => (
            <FadeIn key={community.id} direction="up" duration={0.5}>
              <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                  <div>
                    <h3 className="text-xl font-medium text-black">{community.name}</h3>
                    <p className="text-sm text-black/50">{community.memberCount} members • {formatCurrency(community.monthlyContribution)}/mo</p>
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
                                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-black">{member.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right tabular-nums">{member.sharePercentage}%</td>
                                <td className="px-6 py-4 text-right tabular-nums font-medium">{formatCurrency(member.totalContributed)}</td>
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
        </Tabs>
      </div>
    </div>
  );
}
