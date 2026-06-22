import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['detonate-trickster-venus.ngrok-free.dev'],
  cacheComponents: true,
  env: {
    // Build-time copyright year — avoids per-request new Date() in components,
    // which breaks Next 16 prerendering. Refreshes on every build/deploy.
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  async redirects() {
    return [
      {
        source: '/collections/:handle/products/:productHandle',
        destination: '/products/:productHandle',
        permanent: true,
      },
    ]
  },
  images: {
    qualities: [68, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'www.teavision.com.au',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
