'use client';

import * as React from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Bell, Users } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-cream">
      <aside className="hidden w-64 border-r border-black/10 bg-white md:block">
        <SidebarNav />
      </aside>

      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium tracking-[-0.02em] text-black">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xl bg-black/5 p-2 text-black/60 transition-colors hover:bg-black/10 hover:text-black"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/60">
                <Users className="h-5 w-5" />
              </div>
              <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white">
                <div className="h-1.5 w-1.5 rounded-full bg-black" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
