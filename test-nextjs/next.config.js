/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Try setting hostname explicitly
  hostname: 'localhost',
  port: 3000,
};

module.exports = nextConfig;