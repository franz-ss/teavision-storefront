import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { ProductSummary } from '@/lib/shopify/types'

import { RelatedProductsCarousel } from './related-products-carousel'

const products: ProductSummary[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'chamomile-organic',
    title: 'Organic Chamomile Premium',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/OrganicChamomilePremium_400x.jpg?v=1727323419',
      altText: 'Organic Chamomile Premium',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '14.27', currencyCode: 'AUD' },
    },
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'organic-ginger-root',
    title: 'Organic Ginger Root Cut',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/OrganicGingerRootCut_400x.jpg?v=1727324371',
      altText: 'Organic Ginger Root Cut',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '9.07', currencyCode: 'AUD' },
    },
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'red-rose-petals',
    title: 'Premium Rose Petals',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/PremiumRosePetals_400x.jpg?v=1727323252',
      altText: 'Premium Rose Petals',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '16.17', currencyCode: 'AUD' },
    },
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'liquorice-root-organic',
    title: 'Organic Licorice Root',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/OrganicLicoriceRoot_400x.jpg?v=1727324022',
      altText: 'Organic Licorice Root',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '7.72', currencyCode: 'AUD' },
    },
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'organic-lemongrass',
    title: 'Organic Lemongrass',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/OrganicLemongrass_400x.jpg?v=1727324811',
      altText: 'Organic Lemongrass',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '7.72', currencyCode: 'AUD' },
    },
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'ginger-cut-dried',
    title: 'Ginger Root Cut',
    featuredImage: {
      url: 'https://www.teavision.com.au/cdn/shop/files/GingerRootCut_400x.jpg?v=1727324206',
      altText: 'Ginger Root Cut',
      width: 400,
      height: 400,
    },
    priceRange: {
      minVariantPrice: { amount: '9.56', currencyCode: 'AUD' },
    },
    rating: 4.8,
    reviewCount: 4,
  },
]

const meta: Meta<typeof RelatedProductsCarousel> = {
  title: 'Product/RelatedProductsCarousel',
  component: RelatedProductsCarousel,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof RelatedProductsCarousel>

export const Default: Story = {
  args: { products },
}
