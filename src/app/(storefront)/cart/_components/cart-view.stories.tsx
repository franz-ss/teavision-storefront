import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import {
  makeCart,
  makeCartLine,
  makeDiscountAllocation,
} from '@/tests/fixtures/shopify/cart'
import { makeMoney } from '@/tests/fixtures/shopify/money'

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
    (Story, context) =>
      context.name === 'Discounted' ? (
        <div className="bg-paper fixed top-0 left-0 w-216 pt-12">
          <Story />
        </div>
      ) : (
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

    await expect(canvas.getByText('Your cart is empty')).toBeInTheDocument()
    await expect(
      canvas.getByRole('link', { name: 'Apply for wholesale' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Browse teas' }),
    ).toBeVisible()
    await expect(canvas.getByText('1,000+ businesses served')).toBeVisible()
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
      canvas.getByText(/When ordering in sizes over 1kg/),
    ).toBeVisible()
    const checkoutLinks = canvas.getAllByRole('link', {
      name: 'Proceed to checkout',
    })
    await expect(checkoutLinks[0]).toHaveAttribute(
      'href',
      'https://checkout.test/cart/test-cart',
    )
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
      cost: {
        subtotalAmount: makeMoney('1626.00'),
        totalAmount: makeMoney('1382.10'),
      },
      lines: [
        makeCartLine({
          quantity: 40,
          cost: {
            amountPerQuantity: makeMoney('40.65'),
            compareAtAmountPerQuantity: makeMoney('40.65'),
            subtotalAmount: makeMoney('1626.00'),
            totalAmount: makeMoney('1382.10'),
          },
          discountAllocations: [
            makeDiscountAllocation({
              title: 'Bulk discount',
              discountedAmount: makeMoney('243.90'),
            }),
          ],
          merchandise: {
            ...makeCartLine().merchandise,
            title: '250g/box',
            product: {
              ...makeCartLine().merchandise.product,
              featuredImage: {
                url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/2003YMiniBrick3.jpg?v=1737510905&width=800',
                altText: '2003Y Mini Ripe Pu-erh Tea Brick (250g/box)',
                width: 800,
                height: 833,
              },
              handle: '2003y-mini-ripe-pu-erh-tea-brick-250g-box',
              title: '2003Y Mini Ripe Pu-erh Tea Brick',
            },
            quantityPriceBreaks: [
              {
                minimumQuantity: 20,
                price: makeMoney('35.77'),
              },
              {
                minimumQuantity: 40,
                price: makeMoney('34.55'),
              },
            ],
          },
        }),
      ],
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Bulk discount')).not.toBeInTheDocument()
    await expect(canvas.queryByText(/Buy .* more/)).not.toBeInTheDocument()
    await expect(
      canvas.getAllByLabelText('Was $1,626.00')[0],
    ).toBeInTheDocument()
    await expect(
      canvas.getAllByLabelText('Now $1,382.10')[0],
    ).toBeInTheDocument()
    await expect(canvas.getByText(/Congratulations! You saved/)).toBeVisible()
    await expect(canvas.getAllByText('$243.90')[0]).toBeVisible()
  },
}

export const PercentageDiscounted: Story = {
  args: {
    cart: makeCart({
      cost: {
        subtotalAmount: makeMoney('624.92'),
        totalAmount: makeMoney('549.93'),
      },
      lines: [
        makeCartLine({
          quantity: 34,
          cost: {
            amountPerQuantity: makeMoney('18.38'),
            compareAtAmountPerQuantity: null,
            subtotalAmount: makeMoney('624.92'),
            totalAmount: makeMoney('549.93'),
          },
          discountAllocations: [
            makeDiscountAllocation({
              title: 'Bulk discount',
              discountedAmount: makeMoney('74.99'),
            }),
          ],
          merchandise: {
            ...makeCartLine().merchandise,
            title: '250g',
            quantityPriceBreaks: [
              {
                minimumQuantity: 40,
                discountPercent: 15,
              },
            ],
            product: {
              ...makeCartLine().merchandise.product,
              featuredImage: {
                url: 'https://www.teavision.com.au/cdn/shop/products/orgrawsticky.jpg?v=1593990292',
                altText: 'Organic Raw Sticky Chai',
                width: 2210,
                height: 2151,
              },
              handle: 'copy-of-peninsula-raw-sticky-chai-loose-leaf',
              title: 'Organic Raw Sticky Chai',
            },
          },
        }),
      ],
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('Buy 6 more and get 15% on each product'),
    ).toBeVisible()
    await expect(canvas.getAllByLabelText('Was $624.92')[0]).toBeVisible()
    await expect(canvas.getAllByLabelText('Now $549.93')[0]).toBeVisible()
    await expect(canvas.getByText(/Congratulations! You saved/)).toBeVisible()
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
