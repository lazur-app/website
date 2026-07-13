import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/blog/lazur-vs-wispr-flow",
        destination: "/compare/lazur-vs-wispr-flow",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
