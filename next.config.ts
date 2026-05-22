import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig = async (): Promise<NextConfig> => {
  // Only run this in development to avoid issues in production
  if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
  }

  return {
    /* config options here */
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    env: {
      NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    }
  };
};

export default nextConfig;
