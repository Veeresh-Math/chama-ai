'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  LineChart, 
  Cpu, 
  Briefcase, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
    { name: 'AI Copilot', href: '/copilot', icon: Cpu },
    { name: 'Gig Escrow', href: '/gigs', icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-cream text-black">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out border-r border-black/5 bg-white/80 backdrop-blur-xl",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold text-xs">
                C
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-medium tracking-tight">Cham.ai</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                    isActive 
                      ? "bg-black text-white shadow-md" 
                      : "text-black/60 hover:bg-black/5 hover:text-black"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-black/5 p-4">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-black/60 transition-all hover:bg-black/5 hover:text-black"
            >
              <Settings className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('chamaai_logged_in');
                window.location.href = '/';
              }}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white/50 px-6 backdrop-blur-md">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 hover:bg-black/5"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-black/5">
              <Bell className="h-5 w-5 text-black/60" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 ring-2 ring-white shadow-sm" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
