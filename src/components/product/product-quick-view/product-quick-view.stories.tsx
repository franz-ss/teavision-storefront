import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import type { Product, ProductSummary } from '@/lib/shopify/types'

import { ProductQuickView } from './product-quick-view'
import type { AddToCart } from '../use-add-to-cart'

const stubProduct: ProductSummary = {
  id: 'gid://shopify/Product/masters-sencha',
  handle: 'tea-masters-sencha',
  title: 'Tea Masters Sencha Green Tea',
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

const quickViewProduct: Product = {
  ...stubProduct,
  description:
    'A bright, grassy green tea with reliable bulk availability for cafe menus, kombucha production, and retail blends.',
  descriptionHtml:
    '<p>A bright, grassy green tea with reliable bulk availability for cafe menus, kombucha production, and retail blends.</p>',
  tags: ['Green tea', 'Wholesale'],
  images: stubProduct.featuredImage ? [stubProduct.featuredImage] : [],
  options: [
    {
      name: 'Size',
      values: ['50g Sample', '1kg', '5kg'],
    },
  ],
  bulkPricingTiers: [],
  variants: [
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-50g',
      title: '50g Sample',
      availableForSale: true,
      price: { amount: '12.00', currencyCode: 'AUD' },
      quantityPriceBreaks: [],
      image: stubProduct.featuredImage,
    },
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-1kg',
      title: '1kg',
      availableForSale: true,
      price: { amount: '88.00', currencyCode: 'AUD' },
      quantityPriceBreaks: [],
    },
    {
      id: 'gid://shopify/ProductVariant/masters-sencha-5kg',
      title: '5kg',
      availableForSale: false,
      price: { amount: '390.00', currencyCode: 'AUD' },
      quantityPriceBreaks: [],
    },
  ],
}

const soldOutProduct: Product = {
  ...quickViewProduct,
  variants: quickViewProduct.variants.map((variant) => ({
    ...variant,
    availableForSale: false,
  })),
}

const addSelectedPackQuantityToCart: AddToCart = async (
  variantId,
  quantity,
) => {
  if (
    variantId !== 'gid://shopify/ProductVariant/masters-sencha-1kg' ||
    quantity !== 2
  ) {
    throw new Error(`Unexpected cart payload: ${variantId} x ${quantity}`)
  }
}

const meta: Meta<typeof ProductQuickView> = {
  title: 'Product/ProductQuickView',
  component: ProductQuickView,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ProductQuickView>

export const Default: Story = {
  args: {
    product: stubProduct,
    initialProduct: quickViewProduct,
  },
}

export const AddToCartTrigger: Story = {
  args: {
    product: stubProduct,
    initialProduct: quickViewProduct,
    addToCart: addSelectedPackQuantityToCart,
    buttonIcon: 'cart',
    buttonLabel: 'Add to cart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))

    await userEvent.selectOptions(
      await canvas.findByRole('combobox', {
        name: 'Select pack size for Tea Masters Sencha Green Tea',
      }),
      'gid://shopify/ProductVariant/masters-sencha-1kg',
    )
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Increase quantity for tea masters sencha green tea',
      }),
    )

    await expect(
      canvas.getByRole('spinbutton', {
        name: 'Quantity for Tea Masters Sencha Green Tea',
      }),
    ).toHaveValue(2)

    await userEvent.click(canvas.getByRole('button', { name: 'Add to Cart' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Added to cart',
    )
  },
}

export const SoldOut: Story = {
  args: {
    product: stubProduct,
    initialProduct: soldOutProduct,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Quick View' }))

    await expect(
      canvas.getByRole('button', { name: 'Sold Out' }),
    ).toBeDisabled()
  },
}

export const FetchError: Story = {
  args: {
    product: stubProduct,
  },
  play: async ({ canvasElement }) => {
    const originalFetch = window.fetch
    window.fetch = async () => new Response(null, { status: 500 })

    try {
      const canvas = within(canvasElement)
      await userEvent.click(canvas.getByRole('button', { name: 'Quick View' }))

      await expect(await canvas.findByRole('alert')).toHaveTextContent(
        'Unable to load product details. Please try again.',
      )
    } finally {
      window.fetch = originalFetch
    }
  },
}
