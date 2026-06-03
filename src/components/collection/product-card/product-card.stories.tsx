import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type { CollectionProductSummary } from '@/lib/shopify/types'

import { ProductCard } from './product-card'

const stubProduct: CollectionProductSummary = {
  id: 'gid://shopify/Product/masters-sencha',
  handle: 'tea-masters-sencha',
  title: 'Tea Masters Sencha Green Tea',
  availableForSale: true,
  productType: 'Green tea',
  tags: ['Wholesale', 'Loose leaf'],
  featuredImage: {
    url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
    altText: 'Loose leaf green tea',
    width: 900,
    height: 900,
  },
  priceRange: {
    minVariantPrice: { amount: '12.00', currencyCode: 'AUD' },
  },
  rating: 4.8,
  reviewCount: 37,
}

const meta: Meta<typeof ProductCard> = {
  title: 'Collection/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: {
    product: stubProduct,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Add to cart' }),
    ).toBeVisible()
  },
}

export const NoImage: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/masters-oolong',
      handle: 'tea-masters-oolong',
      title: 'Tea Masters High Mountain Oolong',
      featuredImage: null,
    },
  },
}

export const MultiVariant: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/masters-breakfast',
      handle: 'tea-masters-breakfast',
      title: 'Tea Masters Breakfast Blend',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Add to cart' }),
    ).toBeVisible()
  },
}

export const SoldOut: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/masters-rwanda',
      handle: 'premium-rwandan-black-tea',
      title: 'Premium Rwandan Black Tea CTC BP',
      availableForSale: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: /add to cart/i }),
    ).not.toBeInTheDocument()
  },
}

export const LongUnbrokenTitleMobile: Story = {
  args: {
    product: {
      ...stubProduct,
      title: 'WholesaleTeaProcurementComplianceSourcingIntelligenceSenchaBlend',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Long product title overflows the mobile canvas')
    }
  },
}
