import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProductCard } from './product-card'
import type { ProductSummary } from '@/lib/shopify/types'

const stubProduct: ProductSummary = {
  id: 'gid://shopify/Product/1',
  handle: 'english-breakfast',
  title: 'English Breakfast — Bulk Loose Leaf',
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '18.00', currencyCode: 'AUD' },
  },
}

const meta: Meta<typeof ProductCard> = {
  title: 'UI/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: { product: stubProduct },
}

export const WithSaleBadge: Story = {
  args: { product: stubProduct, badge: 'sale' },
}

export const WithNewBadge: Story = {
  args: { product: stubProduct, badge: 'new' },
}

export const OutOfStock: Story = {
  args: { product: stubProduct, badge: 'outOfStock' },
}
