// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
    images: {
    unoptimized: true,
  },
  // experimental: {
  //   turbo: false, // ✅ Disable Turbopack to fix font loading issue
  // },
};

export default nextConfig;
