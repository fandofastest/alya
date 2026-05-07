import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/external-upload",
        destination: process.env.EXTERNAL_UPLOAD_URL || "https://serverkpu.fando.id/api/integrations/uploads",
      },
    ];
  },
};

export default nextConfig;
