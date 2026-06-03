import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { QuickAddButton } from './quick-add-button'

async function successfulAddToCart() {}

async function failingAddToCart() {
  throw new Error('Unable to add to cart.')
}

function pendingAddToCart() {
  return new Promise<never>(() => undefined)
}

const meta: Meta<typeof QuickAddButton> = {
  title: 'Collection/QuickAddButton',
  component: QuickAddButton,
  tags: ['autodocs'],
  args: {
    addToCart: successfulAddToCart,
    productTitle: 'Tea Masters Sencha',
    variantId: 'gid://shopify/ProductVariant/tea-masters-sencha-default',
  },
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof QuickAddButton>

export const Default: Story = {
  args: {},
}

export const Success: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Tea Masters Sencha to cart' }),
    )

    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Added to cart',
    )
  },
}

export const AddToCartError: Story = {
  args: {
    addToCart: failingAddToCart,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Tea Masters Sencha to cart' }),
    )

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Unable to add to cart. Please try again.',
    )
  },
}

export const Pending: Story = {
  args: {
    addToCart: pendingAddToCart,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Tea Masters Sencha to cart' }),
    )

    await expect(
      await canvas.findByRole('button', {
        name: 'Add Tea Masters Sencha to cart',
      }),
    ).toBeDisabled()
  },
}

export const SoldOut: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Tea Masters Sencha is sold out' }),
    ).toBeDisabled()
  },
}
