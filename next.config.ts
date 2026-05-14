import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/video/**": ["./node_modules/youtubei.js/**/*"],
  },
};

export default nextConfig;
