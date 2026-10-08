'use client';

import * as React from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import {
  MessageSquare,
  Plus,
  DollarSign,
  TrendingUp,
  Shield,
  Brain,
  Settings,
  RefreshCw,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { LineChart } from 'recharts'; // We'll use chart from shadcn, but this is for example

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
    title: 'Reduce food expenses by 15%',
    description: 'Based on your spending patterns, you could save $75/month by meal planning and buying groceries in bulk.',
    impact: '$75/month',
    action: 'View meal planning tips',
  },
  {
    id: '2',
    type: 'investment',
    title: 'Emergency fund recommendation',
    description: 'Your current savings rate suggests you should aim for 3-6 months of expenses in an emergency fund.',
    impact: '$1,800 target',
    action: 'Set up automatic savings',
  },
  {
    id: '3',
    type: 'income',
    title: 'Skill upgrade opportunity',
    description: 'Learning React Native could increase your freelance rates by 20-30%.',
    impact: '$100+/project',
    action: 'Explore learning resources',
  },
];

export default function CopilotPage() {
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('30');
  const [agentResponse, setAgentResponse] = React.useState('');
  const [isAgentThinking, setIsAgentThinking] = React.useState(false);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API
    console.log('Adding transaction:', formData);
    setShowTransactionModal(false);
    setFormData({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const getAgentAdvice = async (question: string) => {
    setIsAgentThinking(true);
    // TODO: Call agent API
    setTimeout(() => {
      setAgentResponse(`Based on your transaction history, here's my advice: "${question}". Your spending looks balanced, but consider tracking cash expenses more closely. Would you like me to analyze any specific category?`);
      setIsAgentThinking(false);
    }, 1500);
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to the backend agent
    setAgentResponse('Analyzing your finances...');
    setIsAgentThinking(true);
    setTimeout(() => {
      setAgentResponse(`Great question! Looking at your last 30 days: Income: $700, Expenses: $280, Net: +$420. Your savings rate is 60% - excellent! Consider allocating 20% of surplus to investments. Would you like specific investment recommendations?`);
      setIsAgentThinking(false);
    }, 2000);
  };

  const totalIncome = mockTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Copilot</h1>
            <p className="text-gray-500 mt-1">Your AI-powered financial advisor for smarter money decisions</p>
          </div>
          <Button onClick={() => setShowTransactionModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
          <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount (negative for expense, positive for income)"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Input
                      list="categories"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Food, Transport, Income, etc."
                    />
                    <datalist id="categories">
                      <option value="Food" />
                      <option value="Transport" />
                      <option value="Housing" />
                      <option value="Utilities" />
                      <option value="Income" />
                      <option value="Entertainment" />
                      <option value="Healthcare" />
                      <option value="Shopping" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this transaction..."
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowTransactionModal(false)}>Cancel</Button>
                  <Button type="submit">Add Transaction</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Balance (30d)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(netBalance)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Income (30d)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Expenses (30d)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Savings Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {savingsRate}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTimeframe('7')}>7d</Button>
                <Button variant={selectedTimeframe === '30' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('30')}>30d</Button>
                <Button variant={selectedTimeframe === '90' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('90')}>90d</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatRelativeTime(txn.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {txn.amount > 0 ? (
                          <span className="text-green-600">+{formatCurrency(txn.amount)}</span>
                        ) : (
                          <span className="text-red-600">{formatCurrency(txn.amount)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs rounded-full bg-gray-100 text-gray-600">
                          {txn.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Agent Chat */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chat with your Financial Copilot</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" /> New Chat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-96 mb-4 overflow-y-auto bg-gray-50 rounded-lg p-4">
              {mockAgentSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start gap-3 mb-4">
                  <Brain className="h-4 w-4 flex-shrink-0 mt-1 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{suggestion.title}</p>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{suggestion.impact}</Badge>
                      <Button variant="link" size="sm" className="text-sm p-0">
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 py-4 border-t">
                {isAgentThinking ? (
                  <div className="flex items-start gap-3">
                    <Brain className="h-4 w-4 flex-shrink-0 mt-1 animate-pulse text-blue-500" />
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Analyzing...</p>
                      <div className="h-1 w-4 bg-gray-300 rounded-full animate-pulse" />
                      <div className="h-1 w-3 bg-gray-300 rounded-full animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/bot.png" alt="AI" />
                      <AvatarFallow>AI</AvatarFallow>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">Financial Copilot</p>
                      <p className="text-sm text-gray-600">Ready to help you optimize your finances</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <form onSubmit={handleAgentSubmit} className="flex items-center gap-2 mt-4">
              <Input
                placeholder="Ask your copilot about spending, saving, or investing..."
                value={agentResponse && !isAgentThinking ? '' : 'Type your question...'}
                onChange={(e) => {
                  if (agentResponse && !isAgentThinking) {
                    setAgentResponse(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAgentThinking && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    handleAgentSubmit(e as React.FormEvent);
                  }
                }}
                className="flex-1"
                disabled={isAgentThinking}
              />
              <Button type="submit" disabled={isAgentThinking}>
                {isAgentThinking ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Thinking...
                  </>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            {agentResponse && !isAgentThinking && (
              <div className="mt-4">
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                  <AvatarImage src="/bot.png" alt="AI" />
                  <AvatarFallow>AI</AvatarFallow>
                </Avatar>
                <div className="flex-1 space-y-1 pt-2 border-t">
                  <p className="font-medium text-gray-900">Financial Copilot</p>
                  <p className="text-sm text-gray-600">{agentResponse}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}