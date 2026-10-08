import './globals.css';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';

export const metadata: Metadata = {
  title: 'Chama.ai',
  description: 'AI-powered community savings and gig worker platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}