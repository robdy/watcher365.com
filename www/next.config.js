/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_USER: process.env.GITHUB_USER,
    GITHUB_REPO: process.env.GITHUB_REPO,
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
