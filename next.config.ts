import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack doesn't handle native .node addons correctly (sharp)
  // Use --webpack flag in build script instead
  serverExternalPackages: ['sharp', '@img/sharp-linux-x64', '@img/sharp-libvips-linux-x64'],
};

export default nextConfig;
