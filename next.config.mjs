/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
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
