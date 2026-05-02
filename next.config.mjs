// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // experimental: {
  //   turbo: false, // ✅ Disable Turbopack to fix font loading issue
  // },
};

export default nextConfig;
