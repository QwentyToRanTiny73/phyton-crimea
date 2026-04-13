/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт для Cloudflare Pages
  output: "export",

  images: {
    // Cloudflare Pages не поддерживает Next.js Image Optimization API
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
