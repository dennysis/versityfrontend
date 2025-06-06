import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
