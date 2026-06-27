import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mongoose ใช้ได้ใน server components / route handlers
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
