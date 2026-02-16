import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivkffvlnwanybszjqzgg.supabase.co',
      },
    ],
  },
  turbopack: {
    root: "c:\\Users\\User\\nova-trade-app",
  },
};

export default nextConfig;

