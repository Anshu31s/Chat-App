/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "chatmsgstore01.blob.core.windows.net",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chatmsgstore01.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
