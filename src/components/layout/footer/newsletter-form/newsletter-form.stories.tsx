import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import {
  FooterNewsletterForm,
  type FooterNewsletterAction,
} from './newsletter-form'

const successAction: FooterNewsletterAction = async () => ({
  success: true,
})

const errorAction: FooterNewsletterAction = async () => ({
  success: false,
  error: 'Please enter a valid email address.',
})

const meta: Meta<typeof FooterNewsletterForm> = {
  title: 'Layout/Footer/Newsletter Form',
  component: FooterNewsletterForm,
  tags: ['autodocs'],
  args: {
    action: successAction,
  },
  decorators: [
    (Story) => (
      <div className="bg-footer p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FooterNewsletterForm>

export const Default: Story = {}

export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email'), 'buyer@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
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
    await userEvent.type(canvas.getByLabelText('Email'), 'buyer@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    )
  },
}
