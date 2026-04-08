/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Разрешить кириллические символы в путях
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
