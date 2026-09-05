import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'portal.auth.tamirsa.com',
        pathname: '/brands/**',
      },
    ],
  },
};

export default nextConfig;
