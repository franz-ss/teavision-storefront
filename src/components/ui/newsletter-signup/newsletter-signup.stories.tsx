import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { NewsletterSignup } from './newsletter-signup'

async function signupAction() {
  return { success: true }
}

const meta: Meta<typeof NewsletterSignup> = {
  title: 'UI/NewsletterSignup',
  component: NewsletterSignup,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof NewsletterSignup>

export const Default: Story = {
  args: {
    action: signupAction,
  },
}

export const Brand: Story = {
  args: {
    action: signupAction,
    tone: 'brand',
  },
}

export const Success: Story = {
  args: {
    action: signupAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email address'), 'a@b.co')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(await canvas.findByRole('status')).toHaveTextContent(
      /You.re in\./,
    )
  },
}

export const Error: Story = {
  args: {
    action: async () => ({
      success: false,
      error: 'Please enter a valid email address.',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email address'), 'a@b.co')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    )
  },
}

export const BrandError: Story = {
  args: {
    action: async () => ({
      success: false,
      error: 'Please enter a valid email address.',
    }),
    tone: 'brand',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email address'), 'a@b.co')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    )
  },
}

export const Pending: Story = {
  args: {
    action: () => new Promise<never>(() => undefined),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email address'), 'a@b.co')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(
      await canvas.findByRole('button', { name: 'Subscribing…' }),
    ).toBeDisabled()
  },
}
