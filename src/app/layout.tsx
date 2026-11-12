import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cham.ai'),
  title: {
    default: 'Cham.ai — Save, invest and grow wealth together',
    template: '%s · Cham.ai',
  },
  description:
    'Cham.ai is the AI-powered wealth collective for community savings circles, investment pools and gig escrow. Pool funds, make decisions together, and settle instantly with PayPal and PYUSD.',
  openGraph: {
    title: 'Cham.ai — AI-powered wealth collective',
    description:
      'Community savings circles, investment pools and gig escrow — with an AI financial copilot built in.',
    type: 'website',
    siteName: 'Cham.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cham.ai — AI-powered wealth collective',
    description:
      'Community savings circles, investment pools and gig escrow — with an AI financial copilot built in.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#EAEAEA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSerif.variable} style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-md focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
