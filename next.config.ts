// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better cPanel compatibility
  output: "standalone",
  
  // Image optimization settings
  images: {
    domains: [
      'localhost',
      '2cd.site', // Add your production domain
      'www.2cd.site'
    ],
    minimumCacheTTL: 60, // 60 seconds cache
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false, // Set to true only for emergency builds
  },

  // Webpack configuration for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Production logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Enable compression in production
  compress: true,
};

export default nextConfig;