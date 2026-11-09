'use client';

import * as React from 'react';
import DashboardLayout from '@/components/dashboard-layout';
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
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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

  React.useEffect(() => {
    fetch('/api/analytics', { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen flex-col items-center justify-center text-center">
          <div className="h-8 w-8 rounded-full border-3 border-black/5 border-t-current animate-spin" />
          <p className="mt-4 text-black/50">Loading analytics…</p>
        </div>
      </DashboardLayout>
    );
  }

  const s = data!.summary;

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
            {['7d', '30d', '90d'].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={data?.range === r ? 'default' : 'outline'}
                className="rounded-lg px-3"
                onClick={() => {
                  // Range selector would require re-fetch; kept simple
                }}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Total Collectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{s.totalCommunities}</div>
              <p className="text-xs text-black/40">Active wealth circles</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{s.totalMembers}</div>
              <p className="text-xs text-black/40">Across all circles</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Total Managed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{formatCurrency(s.totalFunds)}</div>
              <p className="text-xs text-black/40">In circle treasuries</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Avg Trust Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {s.avgTrustScore}<span className="text-sm font-medium text-black/50 ml-1">/100</span>
              </div>
              <Badge
                variant={s.avgTrustScore >= 80 ? 'default' : 'secondary'}
                className="text-xs"
              >
                {s.avgTrustScore >= 80 ? 'Healthy' : 'Needs attention'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Total Contributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{formatCurrency(s.totalContributed)}</div>
              <p className="text-xs text-black/40">{s.contributionCount} contributions</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Total Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-emerald-600">
                {formatCurrency(s.totalDistributed)}
              </div>
              <p className="text-xs text-black/40">{s.distributionCount} payouts</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Net Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-medium ${s.netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(s.netFlow)}
              </div>
              <p className="text-xs text-black/40">In minus out</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black/50">Pending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-amber-600">
                {formatCurrency(
                  data!.communityBreakdown.reduce((sum, c) => sum + c.pending, 0)
                )}
              </div>
              <p className="text-xs text-black/40">Awaiting payout</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contribution Trend */}
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-black/50">Contribution Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data!.trend}>
                    <CartesianGrid strokeDasharray="3 3" className="text-black/10" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-black/40" />
                    <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} className="text-black/40" />
                    <Tooltip />
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
            </CardContent>
          </Card>

          {/* Per-Community Breakdown */}
          <Card className="rounded-3xl border-black/5 bg-white p-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-black/50">Funds by Collective</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data!.communityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="text-black/10" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-black/40" />
                    <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} className="text-black/40" />
                    <Tooltip />
                    <Bar dataKey="totalFunds" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Table */}
        <Card className="rounded-3xl border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black/50">Collective Details</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
