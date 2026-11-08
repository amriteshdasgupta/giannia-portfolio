import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition>: catalog items morph into their detail page
    viewTransition: true,
  },
};

export default nextConfig;
