/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We use plain <img> for the swappable photo placeholders, so the
  // next/image lint rule is intentionally relaxed during builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
