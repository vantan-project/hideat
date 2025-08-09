import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "placehold.jp",
      "places.googleapis.com",
      "s3-hideat.s3.ap-northeast-1.amazonaws.com",
    ],
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
