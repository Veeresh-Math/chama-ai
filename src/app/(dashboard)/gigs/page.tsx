'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaymentModal } from '@/components/payment-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency, cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Play,
  FileUp,
  Loader2,
} from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  percentage: number;
  amount: string;
  isCompleted: boolean;
  completedAt: string | null;
  paypalPaymentId: string | null;
}

interface GigJob {
  id: string;
  title: string;
  description: string | null;
  clientEmail: string;
  clientName: string | null;
  totalBudget: string;
  currency: string;
  status: string;
  freelancerId: string;
  paypalPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  milestones: Milestone[];
  freelancer: {
    id: string;
    email: string;
    fullName: string | null;
  } | null;
}

interface CreateGigFormData {
  title: string;
  description: string;
  freelancerEmail: string;
  clientName: string;
  totalBudget: number;
  currency: string;
  milestones: Array<{ name: string; description: string; percentage: number }>;
}

export default function GigsPage() {
  const [jobs, setJobs] = React.useState<GigJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState<{
    open: boolean;
    milestone: Milestone;
    job: GigJob;
    freelancerEmail: string;
    payoutBatchId: string;
    amount: string;
  } | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [verifying, setVerifying] = React.useState<Set<string>>(new Set());

  const getProgress = (job: GigJob) => {
    const completed = job.milestones.filter(m => m.isCompleted).length;
    return job.milestones.length > 0 ? (completed / job.milestones.length) * 100 : 0;
  };

  const getCompletedAmount = (job: GigJob) => {
    return job.milestones
      .filter(m => m.isCompleted)
      .reduce((sum, m) => sum + Number(m.amount), 0);
  };

  // Fetch real gig jobs from API
  React.useEffect(() => {
    loadGigs();
  }, []);

  const router = useRouter();

  async function loadGigs() {
    try {
      setLoading(true);
      const res = await fetch('/api/gigs', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load gigs');
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGig(data: CreateGigFormData) {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create gig');
      }
      const result = await res.json();
      setJobs(prev => [result.job, ...prev]);
      setShowCreateDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gig');
    } finally {
      setCreating(false);
    }
  }

  async function verifyMilestone(jobId: string, milestoneIndex: number) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const milestone = job.milestones[milestoneIndex - 1];
    if (!milestone || milestone.isCompleted) return;

    setVerifying(prev => new Set(prev).add(`${jobId}-${milestoneIndex}`));

    try {
      const res = await fetch(`/api/gigs/${jobId}/complete-milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ milestone_index: milestoneIndex }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to verify milestone');
      }

      const result = await res.json();

      // Optimistic update: update the job in state
      setJobs(prev =>
        prev.map(j => {
          if (j.id !== jobId) return j;
          return {
            ...j,
            milestones: j.milestones.map(m =>
              m.id === milestone.id
                ? { ...m, isCompleted: true, completedAt: new Date().toISOString(), paypalPaymentId: result.payoutBatchId }
                : m
            ),
            status: result.job.status,
          };
        })
      );

      // Show payment confirmation modal
      setShowPaymentModal({
        open: true,
        milestone,
        job,
        freelancerEmail: job.freelancer?.email || job.clientEmail,
        payoutBatchId: result.payoutBatchId,
        amount: milestone.amount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify milestone');
    } finally {
      setVerifying(prev => { const next = new Set(prev); next.delete(`${jobId}-${milestoneIndex}`); return next; });
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-black/50">Loading gigs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
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
              <Button
                className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Initialize Escrow
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[32px] sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-medium tracking-tight">Initialize Gig Escrow</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-6 py-4"
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const milestonesRaw = formData.getAll('milestone_name');
                  const percentagesRaw = formData.getAll('milestone_percentage');
                  const milestones = milestonesRaw.map((name, i) => ({
                    name: name as string,
                    description: (formData.getAll('milestone_description')[i] as string) || '',
                    percentage: Number(percentagesRaw[i] as string) || 0,
                  }));
                  handleCreateGig({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    freelancerEmail: formData.get('freelancer_email') as string,
                    clientName: formData.get('client_name') as string,
                    totalBudget: Number(formData.get('total_budget')),
                    currency: (formData.get('currency') as string) || 'USD',
                    milestones,
                  });
                }}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40">Job Title</label>
                    <Input
                      name="title"
                      className="rounded-xl border-black/10 h-11 focus-visible:ring-black"
                      placeholder="e.g., Website Redesign"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40">Client Email</label>
                    <Input
                      name="freelancer_email"
                      type="email"
                      className="rounded-xl border-black/10 h-11 focus-visible:ring-black"
                      placeholder="freelancer@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/40">Client Name</label>
                  <Input
                    name="client_name"
                    className="rounded-xl border-black/10 h-11 focus-visible:ring-black"
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                    <Input
                      name="total_budget"
                      type="number"
                      className="rounded-xl border-black/10 h-11 pl-10 focus-visible:ring-black"
                      placeholder="5000"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-black/40 mt-1">Total budget held in escrow</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/40 block mb-2">
                    Milestones (must total 100%)
                  </label>
                  <div id="milestones_container" className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        name="milestone_name"
                        className="flex-1 rounded-xl border-black/10 h-10 focus-visible:ring-black"
                        placeholder="Discovery & Research"
                        required
                      />
                      <Input
                        name="milestone_percentage"
                        type="number"
                        className="w-16 rounded-xl border-black/10 h-10 focus-visible:ring-black"
                        placeholder="20"
                        required
                      />
                      <Input
                        name="milestone_description"
                        className="flex-1 rounded-xl border-black/10 h-10 focus-visible:ring-black"
                        placeholder="Description (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const container = document.getElementById('milestones_container');
                          const clone = container?.lastElementChild?.cloneNode(true) as HTMLElement;
                          const inputs = clone.querySelectorAll('input');
                          inputs.forEach(input => (input.value = ''));
                          container?.appendChild(clone);
                        }}
                        className="rounded-xl bg-black/5 px-3 py-2 text-black hover:bg-black/10"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-black/40 mt-1">
                    Add milestones with percentages that total 100%. Each milestone releases payment when verified.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreateDialog(false)}
                    className="rounded-full h-11"
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90"
                    disabled={creating}
                  >
                    Lock Funds in Escrow
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{
            label: 'Active Jobs',
            value: jobs.filter(j => j.status === 'active').length,
            icon: Briefcase,
            color: 'text-black',
          },
          {
            label: 'Pipeline Value',
            value: formatCurrency(
              jobs.reduce((sum, j) => sum + Number(j.totalBudget), 0)
            ),
            icon: DollarSign,
            color: 'text-emerald-600',
          },
          {
            label: 'Settled Capital',
            value: formatCurrency(
              jobs.reduce((sum, j) => sum + getCompletedAmount(j), 0)
            ),
            icon: CheckCircle,
            color: 'text-blue-600',
          },
          {
            label: 'Network Efficiency',
            value: `${Math.round(jobs.reduce((sum, j) => sum + getProgress(j), 0) / Math.max(jobs.length, 1))}%`,
            icon: Target,
            color: 'text-orange-600',
          },
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
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  {stat.label}
                </p>
                <p className="text-2xl font-medium tabular-nums text-black tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Error display */}
        {error && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

      {/* Empty state */}
      {jobs.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="h-12 w-12 text-black/10 mb-4" />
          <h3 className="text-lg font-medium text-black">No gig jobs yet</h3>
          <p className="text-black/50 max-w-sm">
            Initialize your first escrow contract. Funds are held securely and released per milestone.
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="mt-6 rounded-full px-6 h-11 bg-black text-white hover:bg-black/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Gig
          </Button>
        </div>
      )}

      {/* Gig Jobs List */}
      <div className="grid gap-8">
        {jobs.map(job => (
          <FadeIn key={job.id} direction="up" delay={0.1} duration={0.5}>
            <div className="rounded-[32px] border border-black/5 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/[0.01] border-b border-black/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-medium text-black tracking-tight">{job.title}</h3>
                    <Badge variant="outline" className="rounded-full text-[10px] font-medium border-black/10 px-2 py-0">
                      {job.clientName}
                    </Badge>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      {job.status === 'active' ? 'Active' : job.status === 'completed' ? 'Completed' : job.status}
                    </div>
                  </div>
                  <p className="text-sm text-black/50 leading-relaxed">{job.description}</p>
                </div>
                <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-black/40">Locked Budget</p>
                    <p className="text-2xl font-medium tabular-nums text-black tracking-tight">
                      {formatCurrency(Number(job.totalBudget))}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-black/5" />
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-black/40">Released</p>
                    <p className="text-2xl font-medium tabular-nums text-emerald-600 tracking-tight">
                      {formatCurrency(getCompletedAmount(job))}
                    </p>
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
                          m.isCompleted
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : 'bg-white border-black/5 hover:border-black/20'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all',
                            m.isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-black/10 text-black/40 group-hover:border-black/30'
                          )}>
                            {m.isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <p className={cn('text-sm font-medium tracking-tight', m.isCompleted ? 'text-emerald-700 line-through' : 'text-black')}>
                              {m.name}
                            </p>
                            <p className="text-xs text-black/40 font-medium">
                              {m.percentage}% • {formatCurrency(Number(m.amount))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {m.isCompleted ? (
                            <Badge className="rounded-full bg-emerald-500 text-white border-0 text-[10px] font-bold uppercase tracking-wider">
                              Settled
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-xs font-bold hover:bg-black/5"
                              disabled={verifying.has(`${job.id}-${idx + 1}`)}
                              onClick={() => verifyMilestone(job.id, idx + 1)}
                            >
                              {verifying.has(`${job.id}-${idx + 1}`) ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-2" />
                                  Verifying…
                                </>
                              ) : (
                                'Verify'
                              )}
                            </Button>
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
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2">
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                        onClick={() => {
                          // Show ledger details
                        }}
                      >
                        <Eye className="h-4 w-4" /> Ledger Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                      >
                        <Edit className="h-4 w-4" /> Adjust Terms
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" /> Archive Contract
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Payment Confirmation Modal */}
      <PaymentModal
        open={showPaymentModal?.open ?? false}
        onClose={() => setShowPaymentModal(null)}
        milestone={{
          id: showPaymentModal?.milestone.id || '',
          name: showPaymentModal?.milestone.name || '',
          amount: showPaymentModal?.milestone.amount || '0',
        }}
        freelancerEmail={showPaymentModal?.freelancerEmail || ''}
        payoutBatchId={showPaymentModal?.payoutBatchId || ''}
      />
    </div>
  );
}
