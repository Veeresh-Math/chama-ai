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
  Briefcase,
  Plus,
  DollarSign,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Send,
  RefreshCw,
  Brain,
  Settings,
  Trash2,
  Edit,
  Eye,
  Target,
  Calendar,
} from 'lucide-react';

const mockGigJobs = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of client\'s Shopify store',
    freelancerId: 'user-1',
    clientEmail: 'client@company.com',
    clientName: 'TechCorp Inc.',
    totalBudget: 5000,
    currency: 'USD',
    status: 'active',
    createdAt: new Date('2024-09-01'),
    milestones: [
      { id: '1', name: 'Discovery & Research', percentage: 20, amount: 1000, isCompleted: true, completedAt: new Date('2024-09-10') },
      { id: '2', name: 'Design Mockups', percentage: 30, amount: 1500, isCompleted: true, completedAt: new Date('2024-09-25') },
      { id: '3', name: 'Development', percentage: 35, amount: 1750, isCompleted: false },
      { id: '4', name: 'Testing & Launch', percentage: 15, amount: 750, isCompleted: false },
    ],
  },
  {
    id: '2',
    title: 'Mobile App MVP',
    description: 'React Native app for food delivery startup',
    freelancerId: 'user-1',
    clientEmail: 'founder@startup.io',
    clientName: 'FoodieApp',
    totalBudget: 8000,
    currency: 'USD',
    status: 'active',
    createdAt: new Date('2024-10-01'),
    milestones: [
      { id: '5', name: 'Project Setup & Architecture', percentage: 15, amount: 1200, isCompleted: true, completedAt: new Date('2024-10-10') },
      { id: '6', name: 'Core Features', percentage: 40, amount: 3200, isCompleted: false },
      { id: '7', name: 'API Integration', percentage: 25, amount: 2000, isCompleted: false },
      { id: '8', name: 'Beta Testing', percentage: 10, amount: 800, isCompleted: false },
      { id: '9', name: 'App Store Deployment', percentage: 10, amount: 800, isCompleted: false },
    ],
  },
];

export default function GigsPage() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    clientEmail: '',
    clientName: '',
    totalBudget: 1000,
    currency: 'USD',
    milestones: '',
  });
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating gig job:', formData);
    setShowCreateDialog(false);
    setFormData({ title: '', description: '', clientEmail: '', clientName: '', totalBudget: 1000, currency: 'USD', milestones: '' });
  };

  const getProgress = (job: typeof mockGigJobs[0]) => {
    const completed = job.milestones.filter(m => m.isCompleted).length;
    return (completed / job.milestones.length) * 100;
  };

  const getCompletedAmount = (job: typeof mockGigJobs[0]) => {
    return job.milestones.filter(m => m.isCompleted).reduce((sum, m) => sum + m.amount, 0);
  };

   return (
     <div>
       <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gig Worker Hub</h1>
            <p className="text-gray-500 mt-1">Track milestones and get paid autonomously with AI-powered verification</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Gig Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Gig Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., E-commerce Website Redesign"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Email *</label>
                    <Input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="client@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Budget *</label>
                    <Input
                      type="number"
                      value={formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                      min="100"
                      step="100"
                      required
                    />
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
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the project scope..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Milestones (one per line, auto-split by percentage)</label>
                  <Textarea
                    value={formData.milestones}
                    onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                    placeholder="Discovery & Research&#10;Design Mockups&#10;Development&#10;Testing & Launch"
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button type="submit">Create Gig Job</Button>
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
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{mockGigJobs.filter(j => j.status === 'active').length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pipeline Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(mockGigJobs.reduce((sum, j) => sum + j.totalBudget, 0))}
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
                  <p className="text-sm text-gray-500">Earned This Month</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(mockGigJobs.reduce((sum, j) => sum + getCompletedAmount(j), 0))}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Completion</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(mockGigJobs.reduce((sum, j) => sum + getProgress(j), 0) / mockGigJobs.length)}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              {mockGigJobs.filter(j => j.status === 'active').map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <Badge variant="outline">{job.clientName}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{job.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(job.totalBudget)}</p>
                        <p className="text-sm text-gray-500">Total Budget</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress: {Math.round(getProgress(job))}%</span>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(getCompletedAmount(job))} earned of {formatCurrency(job.totalBudget)}
                        </span>
                      </div>
                      <Progress value={getProgress(job)} className="h-3" />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Milestones</h4>
                      {job.milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                          className={cn(
                            'flex items-center gap-4 p-3 rounded-lg border transition-colors',
                            milestone.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          )}
                        >
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full border-2 flex-shrink-0',
                            milestone.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-400'
                          )}>
                            {milestone.isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium', milestone.isCompleted ? 'text-green-700 line-through' : 'text-gray-900')}>
                              {milestone.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {milestone.percentage}% • {formatCurrency(milestone.amount)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {milestone.isCompleted && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" /> Completed
                              </Badge>
                            )}
                            {!milestone.isCompleted && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {job.milestones.every(m => m.isCompleted) && job.status !== 'completed' && (
                          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                            <Send className="h-4 w-4" />
                            Request Payment
                          </Button>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Button variant="link" className="flex items-center gap-2"><Eye className="h-4 w-4" /> View Details</Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button variant="link" className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Milestones</Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" /> Archive Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No completed jobs yet</h3>
              <p className="text-gray-500 mt-1">Complete all milestones to mark jobs as done and trigger payments</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}