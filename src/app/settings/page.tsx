'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';
import { useAuth } from '@/lib/auth/client';
import { FadeIn } from '@/components/animations';
import {
  User,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Wallet,
  CreditCard as CreditCardIcon,
  ArrowLeft,
} from 'lucide-react';

export default function SettingsPage() {
  const auth = useAuth();
  const user = auth.status === 'authenticated' ? auth.user : null;

  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [paypalConnected, setPaypalConnected] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setNotifications(localStorage.getItem('chamai_notifications') === 'true');
    setEmailAlerts(localStorage.getItem('chamai_email_alerts') === 'true');
    setHydrated(true);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const savePreferences = () => {
    localStorage.setItem('chamai_notifications', String(notifications));
    localStorage.setItem('chamai_email_alerts', String(emailAlerts));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <FadeIn direction="up" duration={0.5}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
                Settings
              </h1>
              <p className="text-black/50 mt-1">
                Manage your Cham.ai account and payment preferences.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:bg-black/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-medium tracking-tight text-black mb-6">
                  Profile
                </h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-black/10 flex items-center justify-center text-black font-medium text-xl">
                      {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <Button variant="ghost" size="sm" className="absolute bottom-0 right-0">
                      Change Photo
                    </Button>
                  </div>
                  <p className="text-lg font-medium text-black">{user?.name ?? 'User'}</p>
                  <p className="text-sm text-black/50">{user?.email ?? ''}</p>
                  <Badge variant="secondary">Verified Member</Badge>
                </div>

                <form className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-black/60">Full Name</span>
                    <Input
                      defaultValue={user?.name}
                      className="rounded-xl border-black/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-black/60">Email</span>
                    <Input
                      type="email"
                      defaultValue={user?.email}
                      className="rounded-xl border-black/10"
                    />
                  </div>
                  <Button type="button" className="w-full rounded-xl">
                    Save Changes
                  </Button>
                </form>
              </div>
            </div>

            {/* Notifications */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-medium tracking-tight text-black mb-6">
                  Notifications
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-black">Payment Alerts</p>
                      <p className="text-sm text-black/50">
                        Get notified when contributions land in your circle.
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        notifications ? 'bg-black' : 'bg-black/10 border-black/20'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform',
                          notifications ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-black">Email Summaries</p>
                      <p className="text-sm text-black/50">
                        Weekly cycle summary and trust score updates.
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        emailAlerts ? 'bg-black' : 'bg-black/10 border-black/20'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform',
                          emailAlerts ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                  <Button
                    type="button"
                    onClick={savePreferences}
                    disabled={!hydrated}
                    className="w-full rounded-xl"
                  >
                    {!hydrated ? 'Loading…' : saved ? 'Saved!' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-medium tracking-tight text-black mb-6">
                  PayPal & PYUSD
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <CreditCardIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">PayPal Account</p>
                        <p className="text-sm text-black/50">
                          {paypalConnected
                            ? 'Connected — payouts enabled'
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={paypalConnected ? 'outline' : 'default'}
                      onClick={() => setPaypalConnected(!paypalConnected)}
                      className="rounded-xl"
                    >
                      {paypalConnected ? 'Disconnect' : 'Connect PayPal'}
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/5 border border-black/10">
                    <p className="text-xs font-medium uppercase tracking-wider text-black/40">
                      PYUSD Settlement
                    </p>
                    <p className="mt-1 text-sm text-black">
                      Enable stablecoin settlement on Arbitrum/Solana for instant,
                      low-fee payouts.
                    </p>
                    <Button variant="outline" className="w-full mt-3 rounded-xl">
                      Enable PYUSD
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8">
            <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-medium tracking-tight text-black mb-6">
                Danger Zone
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-black">Sign Out</p>
                      <p className="text-sm text-black/50">
                        Sign out of your Cham.ai account.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="rounded-xl px-4"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
