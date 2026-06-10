import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { CartLineActions } from './cart-line-actions'

type CartLineAction = NonNullable<
  ComponentProps<typeof CartLineActions>['action']
>

const successAction: CartLineAction = async () => ({ message: null })

const errorAction: CartLineAction = async () => ({
  message: 'We could not update your cart. Please try again.',
})

const pendingAction: CartLineAction = () => new Promise<never>(() => undefined)

const capturedActions: Array<Record<string, FormDataEntryValue>> = []

const captureAction: CartLineAction = async (_previousState, formData) => {
  capturedActions.push(Object.fromEntries(formData.entries()))
  return { message: null }
}

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
      <div className="flex max-w-3xl items-center gap-3 p-4">
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
    minimumQuantity: 5,
    quantity: 5,
    quantityIncrement: 5,
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

export const QuantityRulePayloads: Story = {
  args: {
    action: captureAction,
    maximumQuantity: 12,
    minimumQuantity: 5,
    quantity: 5,
    quantityIncrement: 5,
  },
  play: async ({ canvasElement }) => {
    capturedActions.length = 0
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Increase quantity of Tea Masters Sencha',
      }),
    )

    await waitFor(() => {
      expect(capturedActions.at(-1)).toEqual({
        intent: 'update',
        lineId: 'gid://shopify/CartLine/1',
        quantity: '10',
      })
    })

    await expect(
      canvas.getByRole('button', {
        name: 'Decrease quantity of Tea Masters Sencha',
      }),
    ).toBeDisabled()
  },
}

export const IncreasePayload: Story = {
  args: {
    action: captureAction,
  },
  play: async ({ canvasElement }) => {
    capturedActions.length = 0
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Increase quantity of Tea Masters Sencha',
      }),
    )

    await waitFor(() => {
      expect(capturedActions.at(-1)).toEqual({
        intent: 'update',
        lineId: 'gid://shopify/CartLine/1',
        quantity: '3',
      })
    })
  },
}

export const DecreasePayload: Story = {
  args: {
    action: captureAction,
  },
  play: async ({ canvasElement }) => {
    capturedActions.length = 0
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Decrease quantity of Tea Masters Sencha',
      }),
    )

    await waitFor(() => {
      expect(capturedActions.at(-1)).toEqual({
        intent: 'update',
        lineId: 'gid://shopify/CartLine/1',
        quantity: '1',
      })
    })
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

export const UpdatePending: Story = {
  args: {
    action: pendingAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const increaseButton = canvas.getByRole('button', {
      name: 'Increase quantity of Tea Masters Sencha',
    })
    await userEvent.click(increaseButton)

    // Optimistic update: the displayed quantity advances immediately and the
    // stepper stays enabled (marked busy) while the server round-trip is pending.
    await expect(await canvas.findByRole('status')).toHaveTextContent('3')
    await waitFor(() => {
      expect(increaseButton).toBeEnabled()
      expect(increaseButton).toHaveAttribute('aria-busy', 'true')
    })
  },
}
