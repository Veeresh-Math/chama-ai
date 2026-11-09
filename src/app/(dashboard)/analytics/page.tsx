'use client';

import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

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

function StatCard({
  label,
  value,
  sublabel,
  colorClass,
  badgeText,
  badgeVariant,
  iconLetter,
}: {
  label: string;
  value: string;
  sublabel: string;
  colorClass: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary';
  iconLetter?: string;
}) {
  return (
    <div className="group relative flex flex-col rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-black/20 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass.replace('text', 'bg')}`}>
          <span className={`text-xs font-medium ${colorClass}`}>{iconLetter || value.charAt(0)}</span>
        </div>
        {badgeText && (
          <Badge variant={badgeVariant} className="text-xs">
            {badgeText}
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-black/50">{label}</p>
      <p className="mt-1 text-2xl font-medium tracking-tight text-black">{value}</p>
      <p className="mt-0.5 text-xs text-black/40">{sublabel}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [range, setRange] = React.useState<'7d' | '30d' | '90d'>('30d');

  React.useEffect(() => {
    fetch(`/api/analytics?range=${range}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 rounded-full border-3 border-black/5 border-t-current animate-spin mb-3" />
        <p className="text-black/50 text-sm">Loading analytics…</p>
      </div>
    );
  }

  const s = data!.summary;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
            Analytics
          </h1>
          <p className="mt-1 text-black/50">
            Cycle performance, contribution health and trust trends across your circles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            key="7d"
            size="sm"
            variant={range === '7d' ? 'default' : 'outline'}
            className="rounded-lg px-3"
            onClick={() => setRange('7d')}
          >
            7d
          </Button>
          <Button
            key="30d"
            size="sm"
            variant={range === '30d' ? 'default' : 'outline'}
            className="rounded-lg px-3"
            onClick={() => setRange('30d')}
          >
            30d
          </Button>
          <Button
            key="90d"
            size="sm"
            variant={range === '90d' ? 'default' : 'outline'}
            className="rounded-lg px-3"
            onClick={() => setRange('90d')}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Collectives"
          value={s.totalCommunities.toString()}
          sublabel="Active wealth circles"
          colorClass="text-blue-600"
          iconLetter="C"
        />
        <StatCard
          label="Total Members"
          value={s.totalMembers.toString()}
          sublabel="Across all circles"
          colorClass="text-emerald-600"
          iconLetter="M"
        />
        <StatCard
          label="Total Managed"
          value={formatCurrency(s.totalFunds)}
          sublabel="In circle treasuries"
          colorClass="text-violet-600"
          iconLetter="T"
        />
        <StatCard
          label="Avg Trust Score"
          value={s.avgTrustScore.toString()}
          sublabel={s.avgTrustScore >= 80 ? 'Healthy' : 'Needs attention'}
          colorClass="text-orange-600"
          badgeText={s.avgTrustScore >= 80 ? 'Healthy' : 'Needs attention'}
          badgeVariant={s.avgTrustScore >= 80 ? 'default' : 'secondary'}
          iconLetter="T"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Contributed"
          value={formatCurrency(s.totalContributed)}
          sublabel={`${s.contributionCount} contributions`}
          colorClass="text-emerald-600"
          iconLetter="C"
        />
        <StatCard
          label="Total Distributed"
          value={formatCurrency(s.totalDistributed)}
          sublabel={`${s.distributionCount} payouts`}
          colorClass="text-emerald-600"
          iconLetter="D"
        />
        <StatCard
          label="Net Flow"
          value={formatCurrency(s.netFlow)}
          sublabel="In minus out"
          colorClass={s.netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          iconLetter="N"
        />
        <StatCard
          label="Pending Distribution"
          value={formatCurrency(
            data!.communityBreakdown.reduce((sum, c) => sum + c.pending, 0),
          )}
          sublabel="Awaiting payout"
          colorClass="text-amber-600"
          iconLetter="P"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Contribution Trend */}
        <div className="lg:col-span-2 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
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
        </div>

        {/* Per-Community Breakdown */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
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
        </div>
      </div>

      {/* Community Table */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
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
      </div>
    </div>
  );
}
