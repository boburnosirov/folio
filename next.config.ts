import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  // ── Performance ───────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  // ── Images: optimization + remote sources ─────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "www.gutenberg.org" },
      { protocol: "https", hostname: "archive.org" },
    ],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [56, 64, 96, 128, 160, 192, 256],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
