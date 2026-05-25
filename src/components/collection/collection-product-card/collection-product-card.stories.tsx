import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { CollectionProductSummary } from '@/lib/shopify/types'

import { CollectionProductCard } from './collection-product-card'

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
  options: [
    {
      name: 'Size',
      values: ['50g Sample', '1kg', '5kg'],
    },
  ],
  variants: [
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-50g',
      title: '50g Sample',
      availableForSale: true,
      price: { amount: '12.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-1kg',
      title: '1kg',
      availableForSale: true,
      price: { amount: '88.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-5kg',
      title: '5kg',
      availableForSale: false,
      price: { amount: '390.00', currencyCode: 'AUD' },
    },
  ],
}

const meta: Meta<typeof CollectionProductCard> = {
  title: 'Collection/CollectionProductCard',
  component: CollectionProductCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof CollectionProductCard>

export const Default: Story = {
  args: {
    product: stubProduct,
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

export const SoldOut: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/masters-rwanda',
      handle: 'premium-rwandan-black-tea',
      title: 'Premium Rwandan Black Tea CTC BP',
      availableForSale: false,
      variants: stubProduct.variants.map((variant) => ({
        ...variant,
        availableForSale: false,
      })),
    },
  },
}
