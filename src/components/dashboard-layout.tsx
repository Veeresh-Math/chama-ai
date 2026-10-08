'use client';

import * as React from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Zap, Users, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white border-r border-gray-200 md:block">
        <SidebarNav />
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
              <Zap className="h-5 w-5 text-primary-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="rounded-md bg-primary-50 p-2 text-primary-600 hover:bg-primary-100">
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary-50">
                <div className="h-1.5 w-1.5 bg-primary-400 rounded-full" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}