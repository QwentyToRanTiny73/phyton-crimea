/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "phyton-crimea.ru",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
