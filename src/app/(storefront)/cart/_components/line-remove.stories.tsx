import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { CartLineRemove } from './line-remove'

type CartLineAction = NonNullable<
  ComponentProps<typeof CartLineRemove>['action']
>

const successAction: CartLineAction = async () => ({ message: null })

const errorAction: CartLineAction = async () => ({
  message: 'We could not remove this item. Please try again.',
})

const pendingAction: CartLineAction = () => new Promise<never>(() => undefined)

const capturedActions: Array<Record<string, FormDataEntryValue>> = []

const captureAction: CartLineAction = async (_previousState, formData) => {
  capturedActions.push(Object.fromEntries(formData.entries()))
  return { message: null }
}

const meta: Meta<typeof CartLineRemove> = {
  title: 'Cart/CartLineRemove',
  component: CartLineRemove,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  args: {
    lineId: 'gid://shopify/CartLine/1',
    productTitle: 'Tea Masters Sencha',
    action: successAction,
  },
}
export default meta

type Story = StoryObj<typeof CartLineRemove>

export const Default: Story = {
  args: {},
}

export const RemovePayload: Story = {
  args: {
    action: captureAction,
  },
  play: async ({ canvasElement }) => {
    capturedActions.length = 0
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Remove Tea Masters Sencha from cart',
      }),
    )

    await waitFor(() => {
      expect(capturedActions.at(-1)).toEqual({
        intent: 'remove',
        lineId: 'gid://shopify/CartLine/1',
      })
    })
  },
}

export const RemoveError: Story = {
  args: {
    action: errorAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Remove Tea Masters Sencha from cart',
      }),
    )

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'We could not remove this item. Please try again.',
    )
  },
}

// Keep the never-resolving pending story LAST — its stuck transition can starve
// state updates in stories mounted after it on the shared root.
export const RemovePending: Story = {
  args: {
    action: pendingAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Remove Tea Masters Sencha from cart',
      }),
    )

    await expect(
      await canvas.findByRole('button', {
        name: 'Remove Tea Masters Sencha from cart',
      }),
    ).toBeDisabled()
  },
}
