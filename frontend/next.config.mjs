/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed optimizations
  productionBrowserSourceMaps: false,

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
