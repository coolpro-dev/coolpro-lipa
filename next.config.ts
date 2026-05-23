import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Legacy static HTML lives in /legacy — not served by Next routes
};

export default nextConfig;
