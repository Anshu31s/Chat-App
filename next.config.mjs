/** @type {import('next').NextConfig} */
const nextConfig = {
  output:"standalone",
  images: {
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
