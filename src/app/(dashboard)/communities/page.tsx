'use client';

import * as React from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import {
  Users,
  Plus,
  DollarSign,
  TrendingUp,
  Shield,
  MoreHorizontal,
  Send,
  RefreshCw,
  Brain,
  Settings,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';

const mockCommunities = [
  {
    id: '1',
    name: 'Nairobi Tech Savings',
    description: 'Monthly savings for software developers',
    ownerId: 'user-1',
    monthlyContribution: 100,
    currency: 'USD',
    autoDistribute: true,
    trustScore: 87,
    totalFunds: 2400,
    memberCount: 12,
    createdAt: new Date('2024-01-15'),
    members: [
      { id: '1', email: 'alice@example.com', name: 'Alice W.', sharePercentage: 8.33, totalContributed: 1200, trustScore: 92 },
      { id: '2', email: 'bob@example.com', name: 'Bob M.', sharePercentage: 8.33, totalContributed: 1100, trustScore: 88 },
      { id: '3', email: 'carol@example.com', name: 'Carol K.', sharePercentage: 8.33, totalContributed: 1000, trustScore: 85 },
    ],
    contributions: [
      { id: '1', amount: 100, status: 'completed', createdAt: new Date('2024-10-01') },
      { id: '2', amount: 100, status: 'completed', createdAt: new Date('2024-09-01') },
    ],
    distributions: [
      { id: '1', totalAmount: 500, status: 'completed', createdAt: new Date('2024-08-15') },
    ],
  },
  {
    id: '2',
    name: 'Women Entrepreneurs Circle',
    description: 'Supporting women-led businesses',
    ownerId: 'user-1',
    monthlyContribution: 50,
    currency: 'USD',
    autoDistribute: false,
    trustScore: 92,
    totalFunds: 800,
    memberCount: 8,
    createdAt: new Date('2024-03-20'),
    members: [
      { id: '4', email: 'diana@example.com', name: 'Diana R.', sharePercentage: 12.5, totalContributed: 600, trustScore: 95 },
      { id: '5', email: 'eve@example.com', name: 'Eve L.', sharePercentage: 12.5, totalContributed: 550, trustScore: 90 },
    ],
    contributions: [],
    distributions: [],
  },
];

export default function CommunitiesPage() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    monthlyContribution: 100,
    currency: 'USD',
    autoDistribute: true,
    memberEmails: '',
  });
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API
    console.log('Creating community:', formData);
    setShowCreateDialog(false);
    setFormData({ name: '', description: '', monthlyContribution: 100, currency: 'USD', autoDistribute: true, memberEmails: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Savings</h1>
            <p className="text-gray-500 mt-1">Manage your chama/tontine savings circles with AI-powered trust scoring</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCommunity} className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Community Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Nairobi Tech Savings"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Contribution *</label>
                    <Input
                      type="number"
                      value={formData.monthlyContribution}
                      onChange={(e) => setFormData({ ...formData, monthlyContribution: parseFloat(e.target.value) || 0 })}
                      min="10"
                      step="10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="KES">KES (KSh)</SelectItem>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                      <SelectItem value="ZAR">ZAR (R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your community's purpose..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Member Emails (one per line) *</label>
                  <Textarea
                    value={formData.memberEmails}
                    onChange={(e) => setFormData({ ...formData, memberEmails: e.target.value })}
                    placeholder="alice@example.com&#10;bob@example.com&#10;carol@example.com"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoDistribute"
                    checked={formData.autoDistribute}
                    onChange={(e) => setFormData({ ...formData, autoDistribute: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="autoDistribute" className="text-sm text-gray-700">
                    Enable autonomous milestone distributions (AI-powered)
                  </label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button type="submit">Create Community</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Communities</p>
                  <p className="text-3xl font-bold text-gray-900">{mockCommunities.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Savings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(mockCommunities.reduce((sum, c) => sum + c.totalFunds, 0))}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Trust Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(mockCommunities.reduce((sum, c) => sum + c.trustScore, 0) / mockCommunities.length)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockCommunities.reduce((sum, c) => sum + c.memberCount, 0)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communities List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockCommunities.map((community) => (
                <Card key={community.id} className="overflow-hidden">
                  <div className={cn('h-2', community.trustScore > 80 ? 'bg-green-500' : community.trustScore > 60 ? 'bg-yellow-500' : 'bg-red-500')} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{community.description}</p>
                      </div>
                      <Badge variant={community.trustScore > 80 ? 'success' : community.trustScore > 60 ? 'warning' : 'destructive'}>
                        Trust: {community.trustScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(community.totalFunds)}</p>
                        <p className="text-xs text-gray-500">Total Funds</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{community.memberCount}</p>
                        <p className="text-xs text-gray-500">Members</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(community.monthlyContribution)}</p>
                        <p className="text-xs text-gray-500">Monthly</p>
                      </div>
                    </div>
                    <Progress value={(community.totalFunds / (community.monthlyContribution * community.memberCount * 12)) * 100} className="h-2" />
                    <p className="text-sm text-gray-500">Progress to annual goal</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">
                        {community.autoDistribute ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Brain className="h-3 w-3" /> Auto-distribute
                          </span>
                        ) : (
                          'Manual distribution'
                        )}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Button variant="link" className="flex items-center gap-2"><Eye className="h-4 w-4" /> View Details</Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button variant="link" className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit</Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button variant="link" className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Distribute Funds</Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              {mockCommunities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{community.name}</CardTitle>
                        <p className="text-sm text-gray-500">{community.memberCount} members • {formatCurrency(community.monthlyContribution)}/month</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={community.autoDistribute ? 'success' : 'secondary'}>
                          {community.autoDistribute ? 'Auto' : 'Manual'}
                        </Badge>
                        <Badge variant="outline">Trust: {community.trustScore}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="members" className="w-full">
                      <TabsList>
                        <TabsTrigger value="members">Members ({community.members.length})</TabsTrigger>
                        <TabsTrigger value="contributions">Contributions ({community.contributions.length})</TabsTrigger>
                        <TabsTrigger value="distributions">Distributions ({community.distributions.length})</TabsTrigger>
                      </TabsList>
                      <TabsContent value="members">
                        <ScrollArea className="h-64">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b text-left text-sm text-gray-500">
                                <th className="pb-2">Member</th>
                                <th className="pb-2">Share</th>
                                <th className="pb-2">Contributed</th>
                                <th className="pb-2">Trust</th>
                                <th className="pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {community.members.map((member) => (
                                <tr key={member.id} className="border-b last:border-0">
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3">{member.sharePercentage}%</td>
                                  <td className="py-3">{formatCurrency(member.totalContributed)}</td>
                                  <td className="py-3">
                                    <Badge variant={member.trustScore > 80 ? 'success' : member.trustScore > 60 ? 'warning' : 'destructive'}>
                                      {member.trustScore}
                                    </Badge>
                                  </td>
                                  <td className="py-3">
                                    <Badge variant="success">Active</Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="contributions">
                        <ScrollArea className="h-64">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b text-left text-sm text-gray-500">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Member</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {community.contributions.map((c) => (
                                <tr key={c.id} className="border-b last:border-0">
                                  <td className="py-3">{formatRelativeTime(c.createdAt)}</td>
                                  <td className="py-3">Member</td>
                                  <td className="py-3">{formatCurrency(c.amount)}</td>
                                  <td className="py-3">
                                    <Badge variant={c.status === 'completed' ? 'success' : 'warning'}>
                                      {c.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="distributions">
                        <ScrollArea className="h-64">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b text-left text-sm text-gray-500">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Triggered By</th>
                              </tr>
                            </thead>
                            <tbody>
                              {community.distributions.map((d) => (
                                <tr key={d.id} className="border-b last:border-0">
                                  <td className="py-3">{formatRelativeTime(d.createdAt)}</td>
                                  <td className="py-3">{formatCurrency(d.totalAmount)}</td>
                                  <td className="py-3">
                                    <Badge variant={d.status === 'completed' ? 'success' : 'warning'}>
                                      {d.status}
                                    </Badge>
                                  </td>
                                  <td className="py-3">{d.triggeredBy}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}