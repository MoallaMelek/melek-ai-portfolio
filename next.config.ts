import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: every route (home, 8 case studies, OG images, sitemap) is generated at build time.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  // A stray package-lock.json in the home directory confuses root detection; pin it here.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
