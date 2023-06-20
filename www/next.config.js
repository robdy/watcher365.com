/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GH_TOKEN: process.env.GH_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
