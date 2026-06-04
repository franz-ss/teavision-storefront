import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import {
  makeCart,
  makeCartLine,
  makeDiscountAllocation,
} from '@/tests/fixtures/shopify/cart'

import { CartView } from './cart-view'

const longTitle =
  'Organic ceremonial-grade green tea with a very long wholesale product title for wrapping checks'

const meta: Meta<typeof CartView> = {
  title: 'Cart/CartView',
  component: CartView,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof CartView>

export const Empty: Story = {
  args: {
    cart: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Your cart is empty.')).toBeInTheDocument()
    await expect(
      canvas.queryByRole('link', { name: 'Proceed to checkout' }),
    ).not.toBeInTheDocument()
  },
}

export const SingleItem: Story = {
  args: {
    cart: makeCart(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('list', { name: 'Cart items' })).toBeVisible()
    await expect(
      canvas.getByText('Shipping and taxes calculated at checkout.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Proceed to checkout' }),
    ).toHaveAttribute('href', 'https://checkout.test/cart/test-cart')
  },
}

export const MultipleItems: Story = {
  args: {
    cart: makeCart({
      lines: [
        makeCartLine(),
        makeCartLine({
          id: 'gid://shopify/CartLine/test-line-2',
          quantity: 3,
          merchandise: {
            ...makeCartLine().merchandise,
            id: 'gid://shopify/ProductVariant/test-variant-2',
            title: '5kg',
          },
        }),
      ],
    }),
  },
}

export const Discounted: Story = {
  args: {
    cart: makeCart({
      lines: [
        makeCartLine({
          discountAllocations: [
            makeDiscountAllocation({ title: 'Bulk discount' }),
            makeDiscountAllocation({ title: null }),
          ],
        }),
      ],
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText('Bulk discount')[0]).toBeVisible()
    await expect(canvas.getAllByText('Discount')[0]).toBeVisible()
  },
}

export const MissingImageAndLongTitle: Story = {
  args: {
    cart: makeCart({
      lines: [
        makeCartLine({
          merchandise: {
            ...makeCartLine().merchandise,
            title: 'Default Title',
            product: {
              handle: 'long-title-tea',
              title: longTitle,
              featuredImage: null,
            },
          },
        }),
      ],
    }),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Long cart item title overflows the mobile canvas')
    }
  },
}
