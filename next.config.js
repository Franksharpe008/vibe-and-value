/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{protocol:'https',hostname:'images.unsplash.com'},{protocol:'https',hostname:'lh3.googleusercontent.com'}],
  },
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
};

module.exports = nextConfig;
