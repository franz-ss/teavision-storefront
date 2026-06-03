import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { HomepageNewsletter } from './newsletter'

const noopAction = async () => ({ success: true })

const errorAction = async () => ({
  success: false,
  error: 'Please enter a valid email address.',
})

function pendingAction() {
  return new Promise<never>(() => undefined)
}

const meta: Meta<typeof HomepageNewsletter> = {
  title: 'Homepage/HomepageNewsletter',
  component: HomepageNewsletter,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}
export default meta

type Story = StoryObj<typeof HomepageNewsletter>

export const Default: Story = {
  args: {},
}

export const Success: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Enter Email'), 'buyer@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Thanks for signing up.',
    )
  },
}

export const Error: Story = {
  args: {
    action: errorAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Enter Email'), 'buyer@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    )
  },
}

export const Pending: Story = {
  args: {
    action: pendingAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Enter Email'), 'buyer@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(
      await canvas.findByRole('button', { name: 'Subscribing…' }),
    ).toBeDisabled()
  },
}
