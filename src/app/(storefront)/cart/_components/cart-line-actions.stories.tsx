import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { CartLineActions } from './cart-line-actions'

type CartLineAction = NonNullable<
  ComponentProps<typeof CartLineActions>['action']
>

const successAction: CartLineAction = async () => ({ message: null })

const errorAction: CartLineAction = async () => ({
  message: 'We could not update your cart. Please try again.',
})

const pendingAction: CartLineAction = () =>
  new Promise<never>(() => undefined)

const meta: Meta<typeof CartLineActions> = {
  title: 'Cart/CartLineActions',
  component: CartLineActions,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  args: {
    lineId: 'gid://shopify/CartLine/1',
    productTitle: 'Tea Masters Sencha',
    quantity: 2,
    action: successAction,
  },
  decorators: [
    (Story) => (
      <div className="grid max-w-3xl grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-4">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof CartLineActions>

export const Default: Story = {
  args: {},
}

export const MinimumQuantity: Story = {
  args: {
    quantity: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', {
        name: 'Decrease quantity of Tea Masters Sencha',
      }),
    ).toBeDisabled()
  },
}

export const UpdateError: Story = {
  args: {
    action: errorAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Increase quantity of Tea Masters Sencha',
      }),
    )

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'We could not update your cart. Please try again.',
    )
  },
}

export const RemovePending: Story = {
  args: {
    action: pendingAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove' }))

    await expect(
      await canvas.findByRole('button', { name: 'Remove' }),
    ).toBeDisabled()
  },
}
