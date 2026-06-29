import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Turn off strict mode to prevent double-initialization of animations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
// Fallback ESM export
module.exports = nextConfig;
