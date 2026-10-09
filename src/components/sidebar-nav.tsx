'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Users,
  TrendingUp,
  MessageSquare,
  Settings,
  Banknote,
  Zap,
} from 'lucide-react';
import { Link } from 'next/router';
import { clsx } from 'clsx';

export function SidebarNav() {
  return (
    <div className="flex flex-col h-full px-2 pt-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Chama.ai</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <Link href="/app/dashboard" className={clsx('flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white', {
          'bg-primary-50 text-white': true // This would be active state logic
        })}>
          <LayoutDashboard className="h-4 w-4" />
          <span className="flex-1">Dashboard</span>
        </Link>
        
        <Link href="/app/gigs" className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white">
          <Wallet className="h-4 w-4" />
          <span className="flex-1">Gig Worker Hub</span>
        </Link>
        
        <Link href="/app/analytics" className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white">
          <TrendingUp className="h-4 w-4" />
          <span className="flex-1">Analytics</span>
        </Link>
        
        <Link href="/app/community" className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white">
          <Users className="h-4 w-4" />
          <span className="flex-1">Community</span>
        </Link>
        
        <Link href="/app/messages" className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white">
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1">Messages</span>
        </Link>
        
        <Link href="/app/settings" className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-white">
          <Settings className="h-4 w-4" />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>
      
      <div className="mb-6">
        <Link href="/app/upgrade" className="w-full flex items-center space-x-3 rounded-md p-3 text-base font-medium text-primary-600 hover:bg-primary-50">
          <Banknote className="h-4 w-4" />
          <span className="flex-1">Upgrade</span>
        </Link>
      </div>
    </div>
  );
}

