import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint is run separately; don't block production builds on Vercel.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Vercel Blob storage (uploaded logo/images in production)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Unsplash placeholders used in seed/demo content
      { protocol: "https", hostname: "images.unsplash.com" },
      // YouTube video thumbnails (videos module)
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  // Allow embedded 360° viewers (momento360) to use device-orientation sensors
  // for mobile look-around — and silence their permissions-policy warnings.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              'accelerometer=(self "https://momento360.com"), gyroscope=(self "https://momento360.com"), magnetometer=(self "https://momento360.com")',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
