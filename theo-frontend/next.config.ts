import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"], // Add both domains to be safe
  },
};

export default nextConfig;
