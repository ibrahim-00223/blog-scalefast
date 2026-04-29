import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "blog-scalefast-production.up.railway.app",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
