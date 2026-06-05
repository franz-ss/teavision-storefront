import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
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
