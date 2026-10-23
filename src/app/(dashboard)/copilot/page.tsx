'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import {
  Plus,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Brain,
  Zap,
  Send,
  ArrowUpRight,
  CreditCard,
  Activity,
} from 'lucide-react';

const mockTransactions = [
  { id: '1', date: '2026-10-01', amount: -50, category: 'Food', description: 'Groceries' },
  { id: '2', date: '2026-10-03', amount: -120, category: 'Utilities', description: 'Electric bill' },
  { id: '3', date: '2026-10-05', amount: 500, category: 'Income', description: 'Freelance payment' },
  { id: '4', date: '2026-10-07', amount: -80, category: 'Transport', description: 'Gas' },
  { id: '5', date: '2026-10-10', amount: -30, category: 'Food', description: 'Lunch' },
  { id: '6', date: '2026-10-12', amount: 200, category: 'Income', description: 'Consulting' },
];

const mockAgentSuggestions = [
  {
    id: '1',
    type: 'saving',
    title: 'Optimize Food Spending',
    description: 'Your patterns suggest a potential $75/month saving via bulk procurement.',
    impact: '$75/mo',
    action: 'Apply Strategy',
  },
  {
    id: '2',
    type: 'investment',
    title: 'Liquid Reserve Alert',
    description: 'Current cash flow allows for a $1,800 emergency fund top-up.',
    impact: 'High Security',
    action: 'Initialize Fund',
  },
];

export default function CopilotPage() {
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [agentResponse, setAgentResponse] = React.useState('');
  const [isAgentThinking, setIsAgentThinking] = React.useState(false);

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgentResponse('Consulting Agent Council...');
    setIsAgentThinking(true);
    setTimeout(() => {
      setAgentResponse(`Council Verdict: Your current savings rate is 60%. We recommend allocating 20% of surplus to the \"High-Yield T-Bill\" pool for an estimated +4.2% APY.`);
      setIsAgentThinking(false);
    }, 2000);
  };

  const totalIncome = mockTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <FadeIn direction="up" duration={0.5}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/40 mb-2">
              <Brain className="h-3 w-3 text-violet-600" />
              Treasury Command Center
            </div>
            <h1 className="text-4xl font-medium tracking-tight text-black sm:text-5xl">
              Financial <span className="font-serif italic text-black/70">Copilot.</span>
            </h1>
            <p className="text-black/50 max-w-md text-sm leading-relaxed">
              AI-powered treasury management and behavioral insights. Managed by the Agent Council.
            </p>
          </div>
          <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10">
                <Plus className="h-4 w-4 mr-2" />
                Log Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[32px] sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-medium tracking-tight">Record Movement</DialogTitle>
              </DialogHeader>
              <form className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/40">Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                    <Input className="rounded-xl border-black/10 h-11 pl-10 focus-visible:ring-black" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/40">Description</label>
                  <Input className="rounded-xl border-black/10 h-11 focus-visible:ring-black" placeholder="What was this for?" />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowTransactionModal(false)} className="rounded-full h-11">Cancel</Button>
                  <Button className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/90">Log Entry</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* Financial Snapshot */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Net Balance', value: formatCurrency(netBalance), icon: DollarSign, color: 'text-black' },
          { label: 'Monthly Income', value: formatCurrency(totalIncome), icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Monthly Outflow', value: formatCurrency(totalExpenses), icon: Activity, color: 'text-red-600' },
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
      </div >

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Transaction Ledger */}
        <FadeIn direction="up" delay={0.3} duration={0.5} className="lg:col-span-2">
          <div className="rounded-[32px] border border-black/5 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.01]">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-black/40" />
                <h3 className="text-lg font-medium text-black tracking-tight">Recent Ledger</h3>
              </div>
              <Badge variant="outline" className="rounded-full font-medium border-black/10 px-3 py-0 text-[10px]">Last 30 Days</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/[0.02] text-black/40 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {mockTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-black/[0.01] transition-colors group">
                      <td className="px-6 py-4 text-black/60 whitespace-nowrap tabular-nums">{formatRelativeTime(txn.date)}</td>
                      <td className="px-6 py-4 font-medium text-black tracking-tight">{txn.description}</td>
                      <td className={`px-6 py-4 text-right tabular-nums font-medium ${txn.amount > 0 ? 'text-emerald-600' : 'text-black'}`}>
                        {txn.amount > 0 ? `+${formatCurrency(txn.amount)}` : formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] uppercase tracking-wider font-bold text-black/60 group-hover:bg-black/10 transition-colors">
                          {txn.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Agentic Insights */}
        <FadeIn direction="up" delay={0.4} duration={0.5}>
          <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm space-y-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 text-violet-700">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Agent Insights</span>
            </div>
            <div className="space-y-4">
              {mockAgentSuggestions.map((sug) => (
                <motion.div 
                  key={sug.id}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 transition-all hover:bg-violet-100/50 group"
                >
                  <p className="text-sm font-semibold text-violet-900 tracking-tight">{sug.title}</p>
                  <p className="text-xs text-violet-700/80 mt-1 leading-relaxed">{sug.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-tighter">{sug.impact}</span>
                    <Button variant="link" className="p-0 text-xs font-bold text-violet-700 hover:text-violet-900">
                      {sug.action}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div >

      {/* Council Terminal */}
      <FadeIn direction="up" delay={0.5} duration={0.5}>
        <div className="rounded-[32px] border border-black/10 bg-black p-8 shadow-2xl text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
             <Brain className="h-24 w-24 text-white/10" />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-medium tracking-tight">Council Terminal</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                STATUS: ACTIVE
              </span>
              <span className="text-white/20">|</span>
              <span>SECURE_LINK: ON</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 h-80 overflow-y-auto font-mono text-sm space-y-4 mb-6 border border-white/10 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
            <div className="text-white/40">{`[SYSTEM]: Awaiting encrypted query...`}</div>
            {agentResponse && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-emerald-400"
              >
                {`[COUNCIL]: ${agentResponse}`}
              </motion.div>
            )}
            {isAgentThinking && (
              <div className="flex items-center gap-2 text-white/60">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-75">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="italic">Council deliberating via consensus engine...</span>
              </div>
            )}
          </div>
          <form onSubmit={handleAgentSubmit} className="flex gap-3 relative z-10">
            <div className="relative flex-1">
              <Input
                className="w-full bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 pl-4 focus-visible:ring-white/20"
                placeholder="Ask the council for a financial verdict..."
              />
            </div>
            <Button className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
