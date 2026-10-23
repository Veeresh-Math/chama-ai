'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency, cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Plus,
  DollarSign,
  CheckCircle,
  MoreHorizontal,
  Eye,
  Trash2,
  Edit,
  Target,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

const mockGigJobs = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of client\'s Shopify store',
    clientName: 'TechCorp Inc.',
    totalBudget: 5000,
    status: 'active',
    councilStatus: 'Monitoring',
    milestones: [
      { id: '1', name: 'Discovery & Research', percentage: 20, amount: 1000, isCompleted: true },
      { id: '2', name: 'Design Mockups', percentage: 30, amount: 1500, isCompleted: true },
      { id: '3', name: 'Development', percentage: 35, amount: 1750, isCompleted: false },
      { id: '4', name: 'Testing & Launch', percentage: 15, amount: 750, isCompleted: false },
    ],
  },
  {
    id: '2',
    title: 'Mobile App MVP',
    description: 'React Native app for food delivery startup',
    clientName: 'FoodieApp',
    totalBudget: 8000,
    status: 'active',
    councilStatus: 'Verifying',
    milestones: [
      { id: '5', name: 'Project Setup', percentage: 15, amount: 1200, isCompleted: true },
      { id: '6', name: 'Core Features', percentage: 40, amount: 3200, isCompleted: false },
      { id: '7', name: 'API Integration', percentage: 25, amount: 2000, isCompleted: false },
      { id: '8', name: 'Beta Testing', percentage: 10, amount: 800, isCompleted: false },
      { id: '9', name: 'Deployment', percentage: 10, amount: 800, isCompleted: false },
    ],
  },
];

export default function GigsPage() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const getProgress = (job: typeof mockGigJobs[0]) => {
    const completed = job.milestones.filter(m => m.isCompleted).length;
    return (completed / job.milestones.length) * 100;
  };

  const getCompletedAmount = (job: typeof mockGigJobs[0]) => {
    return job.milestones.filter(m => m.isCompleted).reduce((sum, m) => sum + m.amount, 0);
  };

   return (
     <div className="space-y-10 pb-20">
        <FadeIn direction="up" duration={0.5}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/40 mb-2">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Escrow Command Center
              </div>
              <h1 className="text-4xl font-medium tracking-tight text-black sm:text-5xl">
                Gig <span className="font-serif italic text-black/70">Hub.</span>
              </h1>
              <p className="text-black/50 max-w-md text-sm leading-relaxed">
                Institutional-grade milestone escrow. Managed by the Agent Council, settled via PayPal.
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10">
                  <Plus className="h-4 w-4 mr-2" />
                  Initialize Escrow
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[32px] sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-medium tracking-tight">Initialize Gig Escrow</DialogTitle>
                </DialogHeader>
                <form className="space-y-6 py-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40">Job Title</label>
                      <Input className="rounded-xl border-black/10 h-11 focus-visible:ring-black" placeholder="e.g., Website Redesign" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40">Client Email</label>
                      <Input className="rounded-xl border-black/10 h-11 focus-visible:ring-black" placeholder="client@company.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40">Total Budget (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                      <Input type="number" className="rounded-xl border-black/10 h-11 pl-10 focus-visible:ring-black" placeholder="5000" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-full h-11">Cancel</Button>
                    <Button className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90">Lock Funds</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Active Jobs', value: mockGigJobs.length, icon: Briefcase, color: 'text-black' },
            { label: 'Pipeline Value', value: formatCurrency(mockGigJobs.reduce((sum, j) => sum + j.totalBudget, 0)), icon: DollarSign, color: 'text-emerald-600' },
            { label: 'Settled Capital', value: formatCurrency(mockGigJobs.reduce((sum, j) => sum + getCompletedAmount(j), 0)), icon: CheckCircle, color: 'text-blue-600' },
            { label: 'Network Efficiency', value: `${Math.round(mockGigJobs.reduce((sum, j) => sum + getProgress(j), 0) / mockGigJobs.length)}%`, icon: Target, color: 'text-orange-600' },
          ].map((stat, i) => (
            <FadeIn key={i} direction="up" delay={i * 0.05} duration={0.5}>
              <div className="rounded-[24px] border border-black/5 bg-white p-6 transition-all hover:border-black/10 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-black/20 group-hover:text-black/40 transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">{stat.label}</p>
                  <p className="text-2xl font-medium tabular-nums text-black tracking-tight">{stat.value}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="grid gap-8">
          {mockGigJobs.map((job, i) => (
            <FadeIn key={job.id} direction="up" delay={i * 0.1} duration={0.5}>
              <div className="rounded-[32px] border border-black/5 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/[0.01] border-b border-black/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-medium text-black tracking-tight">{job.title}</h3>
                      <Badge variant="outline" className="rounded-full text-[10px] font-medium border-black/10 px-2 py-0">{job.clientName}</Badge>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        {job.councilStatus}
                      </div>
                    </div>
                    <p className="text-sm text-black/50 leading-relaxed">{job.description}</p>
                  </div>
                  <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-black/40">Locked Budget</p>
                      <p className="text-2xl font-medium tabular-nums text-black tracking-tight">{formatCurrency(job.totalBudget)}</p>
                    </div>
                    <div className="h-10 w-px bg-black/5" />
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-black/40">Released</p>
                      <p className="text-2xl font-medium tabular-nums text-emerald-600 tracking-tight">{formatCurrency(getCompletedAmount(job))}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                      <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-black/40">Overall Progress</span>
                          <span className="text-black">{Math.round(getProgress(job))}%</span>
                        </div>
                        <Progress value={getProgress(job)} className="h-1.5 bg-black/5" />
                        <p className="text-[11px] text-black/40 italic leading-relaxed">
                          Agent Council has verified {job.milestones.filter(m => m.isCompleted).length} of {job.milestones.length} milestones.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-800">
                        <Zap className="h-4 w-4 shrink-0" />
                        <p className="text-[11px] font-medium leading-tight">
                          Next payout triggers automatically upon milestone verification.
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2 grid gap-3">
                      {job.milestones.map((m, idx) => (
                        <motion.div 
                          key={m.id} 
                          whileHover={{ x: 4 }}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-2xl border transition-all group',
                            m.isCompleted ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-black/5 hover:border-black/20'
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all',
                              m.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-black/10 text-black/40 group-hover:border-black/30'
                            )}>
                              {m.isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                            </div>
                            <div>
                              <p className={cn('text-sm font-medium tracking-tight', m.isCompleted ? 'text-emerald-700 line-through' : 'text-black')}>
                                {m.name}
                              </p>
                              <p className="text-xs text-black/40 font-medium">{m.percentage}% • {formatCurrency(m.amount)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {m.isCompleted ? (
                              <Badge className="rounded-full bg-emerald-500 text-white border-0 text-[10px] font-bold uppercase tracking-wider">Settled</Badge>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold hover:bg-black/5">Verify</Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[11px] text-black/40 font-medium">
                        <ShieldCheck className="h-3 w-3" />
                        Payouts via <span className="text-black font-bold">PayPal SDK</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm"><Eye className="h-4 w-4" /> Ledger Details</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm"><Edit className="h-4 w-4" /> Adjust Terms</DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem className="text-red-600 cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"><Trash2 className="h-4 w-4" /> Archive Contract</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
