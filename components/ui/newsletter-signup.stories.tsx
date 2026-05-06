import type { Meta, StoryObj } from '@storybook/nextjs-vite'

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
