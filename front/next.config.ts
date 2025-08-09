import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["placehold.jp", "places.googleapis.com"], // ← ここを追加
  },
};

export default nextConfig;
