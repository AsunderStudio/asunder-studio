import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Static HTML chat experience lives at public/team/index.html
      { source: "/team", destination: "/team/index.html" },
      { source: "/team/", destination: "/team/index.html" },
    ];
  },
};

export default nextConfig;
