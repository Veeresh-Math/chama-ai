'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  LineChart as LineChartIcon,
  Users,
  ShieldCheck,
  Briefcase,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { PageShell, StatCard, GsapCard, SectionCard, COLORS } from '@/components/design-system';

interface AnalyticsData {
  range: string;
  summary: {
    totalCommunities: number;
    totalMembers: number;
    totalFunds: number;
    avgTrustScore: number;
    totalContributed: number;
    contributionCount: number;
    totalDistributed: number;
    distributionCount: number;
    netFlow: number;
  };
  communityBreakdown: Array<{
    id: string;
    name: string;
    trustScore: number;
    totalFunds: number;
    memberCount: number;
    contributed: number;
    distributed: number;
    pending: number;
  }>;
  trend: Array<{ date: string; amount: number; count: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [range, setRange] = React.useState<'7d' | '30d' | '90d'>('30d');
  const router = useRouter();

  // GSAP entrance animation
  useEffect(() => {
    gsap.from('.gsap-analytics-fade', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }, [data, range]);

  React.useEffect(() => {
    fetch(`/api/analytics?range=${range}`, { credentials: 'include' })
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return;
        }
        return r.json();
      })
      .then((json) => {
        if (json) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to load analytics');
      });
  }, [range]);

  const [error, setError] = React.useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 rounded-full border-3 border-black/5 border-t-current animate-spin mb-3" />
        <p className="text-black/50 text-sm">Loading analytics…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <RefreshCw className="h-8 w-8 mb-3 animate-spin" />
        <h2 className="text-xl font-medium text-black">{error}</h2>
        <Button onClick={() => { setError(null); setLoading(true); }} className="mt-4 rounded-xl">
          Retry
        </Button>
      </div>
    );
  }

  const s = data!.summary;

  return (
    <PageShell
      title="Analytics"
      subtitle="Cycle performance, contribution health and trust trends across your circles"
    >
      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 gsap-analytics-fade">
        <StatCard
          label="Total Collectives"
          value={s.totalCommunities.toString()}
          sublabel="Active wealth circles"
          colorClass="text-blue-600"
          bg="bg-blue-50"
          icon={LineChart}
        />
        <StatCard
          label="Total Members"
          value={s.totalMembers.toString()}
          sublabel="Across all circles"
          colorClass="text-emerald-600"
          bg="bg-emerald-50"
          icon={Users}
        />
        <StatCard
          label="Total Managed"
          value={formatCurrency(s.totalFunds)}
          sublabel="In circle treasuries"
          colorClass="text-violet-600"
          bg="bg-violet-50"
          icon={ShieldCheck}
        />
        <StatCard
          label="Avg Trust Score"
          value={s.avgTrustScore.toString()}
          sublabel={s.avgTrustScore >= 80 ? 'Healthy' : 'Needs attention'}
          colorClass="text-orange-600"
          bg="bg-orange-50"
          icon={ShieldCheck}
          badgeText={s.avgTrustScore >= 80 ? 'Healthy' : 'Needs attention'}
          badgeVariant={s.avgTrustScore >= 80 ? 'default' : 'secondary'}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 gsap-analytics-fade">
        <StatCard
          label="Total Contributed"
          value={formatCurrency(s.totalContributed)}
          sublabel={`${s.contributionCount} contributions`}
          colorClass="text-emerald-600"
          bg="bg-emerald-50"
          icon={LineChart}
        />
        <StatCard
          label="Total Distributed"
          value={formatCurrency(s.totalDistributed)}
          sublabel={`${s.distributionCount} payouts`}
          colorClass="text-emerald-600"
          bg="bg-emerald-50"
          icon={ShieldCheck}
        />
        <StatCard
          label="Net Flow"
          value={formatCurrency(s.netFlow)}
          sublabel="In minus out"
          colorClass={s.netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          bg={s.netFlow >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}
          icon={LineChart}
        />
        <StatCard
          label="Pending Distribution"
          value={formatCurrency(
            data!.communityBreakdown.reduce((sum, c) => sum + c.pending, 0),
          )}
          sublabel="Awaiting payout"
          colorClass="text-amber-600"
          bg="bg-amber-50"
          icon={Briefcase}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 gsap-analytics-fade">
        {/* Contribution Trend */}
        <GsapCard className="lg:col-span-2 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-black/50">Contribution Trend</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data!.trend}>
                <CartesianGrid strokeDasharray="3 3" className="text-black/10" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-black/40" />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} className="text-black/40" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GsapCard>

        {/* Per-Community Breakdown */}
        <GsapCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-black/50">Funds by Collective</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data!.communityBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="text-black/10" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-black/40" />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} className="text-black/40" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }} />
                <Bar dataKey="totalFunds" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GsapCard>
      </div>

      {/* Community Table */}
      <GsapCard className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-black/50">Collective Details</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-black/5">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-black/40 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Collective</th>
                <th className="px-6 py-3 text-right">Trust</th>
                <th className="px-6 py-3 text-right">Members</th>
                <th className="px-6 py-3 text-right">Funds</th>
                <th className="px-6 py-3 text-right">Contributed</th>
                <th className="px-6 py-3 text-right">Distributed</th>
                <th className="px-6 py-3 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {data!.communityBreakdown.map((c) => (
                <tr key={c.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium text-black">{c.name}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="outline" className="rounded-full">
                      {c.trustScore}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums">{c.memberCount}</td>
                  <td className="px-6 py-4 text-right tabular-nums font-medium">
                    {formatCurrency(c.totalFunds)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums">
                    {formatCurrency(c.contributed)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-emerald-600">
                    {formatCurrency(c.distributed)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-amber-600">
                    {formatCurrency(c.pending)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GsapCard>
    </PageShell>
  );
}
