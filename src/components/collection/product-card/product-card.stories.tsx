import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type {
  CollectionProductSummary,
  ProductVariant,
} from '@/lib/shopify/types'

import { ProductCard } from './product-card'

const variants: ProductVariant[] = [
  {
    id: 'gid://shopify/ProductVariant/masters-sencha-50g',
    title: '50g Sample',
    availableForSale: true,
    quantityAvailable: 10,
    quantityRule: {
      minimum: 1,
      maximum: 10,
      increment: 1,
    },
    price: { amount: '12.00', currencyCode: 'AUD' },
    quantityPriceBreaks: [],
    image: null,
  },
  {
    id: 'gid://shopify/ProductVariant/masters-sencha-1kg',
    title: '1kg',
    availableForSale: true,
    quantityAvailable: 4,
    quantityRule: {
      minimum: 1,
      maximum: 4,
      increment: 1,
    },
    price: { amount: '88.00', currencyCode: 'AUD' },
    quantityPriceBreaks: [],
    image: null,
  },
]

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
  variants,
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

    // Eyebrow renders for non-empty productType
    await expect(canvas.getByText('Green tea')).toBeVisible()

    // Pack size select still renders (multi-variant product)
    await expect(
      canvas.getByRole('combobox', {
        name: 'Select pack size for Tea Masters Sencha Green Tea',
      }),
    ).toBeVisible()

    // QuantityStepper is hidden in listing context (showQuantity={false})
    await expect(
      canvas.queryByRole('spinbutton', {
        name: 'Quantity for Tea Masters Sencha Green Tea',
      }),
    ).not.toBeInTheDocument()

    // Add to cart button still renders
    await expect(
      canvas.getByRole('button', { name: /^Add to cart$/ }),
    ).toBeVisible()

    // More info link is gone
    await expect(
      canvas.queryByRole('link', { name: /more info/i }),
    ).not.toBeInTheDocument()
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
      canvas.getByRole('combobox', {
        name: 'Select pack size for Tea Masters Breakfast Blend',
      }),
    ).toBeVisible()

    // QuantityStepper is hidden in listing context (showQuantity={false})
    await expect(
      canvas.queryByRole('spinbutton', {
        name: 'Quantity for Tea Masters Breakfast Blend',
      }),
    ).not.toBeInTheDocument()

    await expect(
      canvas.getByRole('button', { name: /^Add to cart$/ }),
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

export const WithCertBadges: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/organic-sencha',
      handle: 'organic-sencha',
      title: 'Organic Sencha Green Tea',
      productType: 'Green tea',
      tags: ['Organic', 'ACO Certified', 'Wholesale'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Both cert badges render (Organic and ACO match first two keywords)
    await expect(canvas.getByText('Organic')).toBeVisible()
    await expect(canvas.getByText('ACO')).toBeVisible()

    // Cap at 2 — Certified badge would be third, should NOT render
    await expect(canvas.queryByText('Certified')).not.toBeInTheDocument()
  },
}

export const NoBrandingInfo: Story = {
  args: {
    product: {
      ...stubProduct,
      id: 'gid://shopify/Product/plain-tea',
      handle: 'plain-tea',
      title: 'House Blend Black Tea',
      productType: '',
      tags: ['Wholesale'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // No eyebrow when productType is empty
    await expect(canvas.queryByText('Green tea')).not.toBeInTheDocument()

    // No cert badge spans
    await expect(canvas.queryByText('Organic')).not.toBeInTheDocument()
    await expect(canvas.queryByText('ACO')).not.toBeInTheDocument()

    // Product title still renders
    await expect(canvas.getByText('House Blend Black Tea')).toBeVisible()
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
