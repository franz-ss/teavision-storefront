import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { Product, ProductSummary } from '@/lib/shopify/types'
import { ProductQuickView } from '@/components/product'

import { ProductCard } from './product-card'

const stubProduct: ProductSummary = {
  id: 'gid://shopify/Product/1',
  handle: 'english-breakfast',
  title: 'English Breakfast — Bulk Loose Leaf',
  featuredImage: {
    url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
    altText: 'English breakfast loose leaf tea',
    width: 900,
    height: 900,
  },
  priceRange: {
    minVariantPrice: { amount: '18.00', currencyCode: 'AUD' },
  },
  rating: 4.7,
  reviewCount: 128,
}

const quickViewProduct: Product = {
  ...stubProduct,
  description:
    'A full-bodied black tea blend with reliable colour, structure, and a classic breakfast cup profile.',
  descriptionHtml:
    '<p>A full-bodied black tea blend with reliable colour, structure, and a classic breakfast cup profile.</p>',
  tags: ['Black tea', 'Wholesale'],
  images: [
    {
      url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
      altText: 'English breakfast loose leaf tea',
      width: 900,
      height: 900,
    },
  ],
  options: [
    {
      name: 'Size',
      values: ['50g Sample', '1kg', '5kg'],
    },
  ],
  variants: [
    {
      id: 'gid://shopify/ProductVariant/1',
      title: '50g Sample',
      availableForSale: true,
      price: { amount: '18.00', currencyCode: 'AUD' },
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
        altText: 'English breakfast sample pouch',
        width: 900,
        height: 900,
      },
    },
    {
      id: 'gid://shopify/ProductVariant/2',
      title: '1kg',
      availableForSale: true,
      price: { amount: '72.00', currencyCode: 'AUD' },
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1kg.jpg?v=1',
        altText: 'English breakfast one kilogram bulk pouch',
        width: 900,
        height: 900,
      },
    },
    {
      id: 'gid://shopify/ProductVariant/3',
      title: '5kg',
      availableForSale: false,
      price: { amount: '315.00', currencyCode: 'AUD' },
    },
  ],
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

export const WithQuickView: Story = {
  args: {
    product: stubProduct,
  },
  render: (args) => (
    <ProductCard
      {...args}
      quickViewAction={
        <ProductQuickView
          product={args.product}
          initialProduct={quickViewProduct}
        />
      }
    />
  ),
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
