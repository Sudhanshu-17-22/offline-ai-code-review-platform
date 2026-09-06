import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: { 
    root: __dirname,
  },
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
export default withBundleAnalyzer(nextConfig);
