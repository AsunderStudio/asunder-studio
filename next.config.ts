import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Static HTML chat experience lives at public/letschat/index.html
      { source: "/letschat", destination: "/letschat/index.html" },
      { source: "/letschat/", destination: "/letschat/index.html" },
    ];
  },
};

export default nextConfig;
