import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Files ending in .dev.tsx (the /admin tools) only exist in `next dev`.
  pageExtensions: isProd ? ['tsx', 'ts'] : ['dev.tsx', 'tsx', 'ts'],
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@react-three/drei'],
  },
};

export default nextConfig;
