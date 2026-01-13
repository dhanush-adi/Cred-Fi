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
  
  // Serverless configuration for edge deployment
  experimental: {
    serverComponentsExternalPackages: ['pino', 'thread-stream'],
  },
}

export default nextConfig
