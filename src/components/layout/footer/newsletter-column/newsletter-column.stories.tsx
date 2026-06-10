import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { FooterNewsletterAction } from '../newsletter-form'
import { NewsletterColumn } from './newsletter-column'

const storyNewsletterAction: FooterNewsletterAction = async () => ({
  success: true,
})

const meta: Meta<typeof NewsletterColumn> = {
  title: 'Layout/Footer/Newsletter Column',
  component: NewsletterColumn,
  tags: ['autodocs'],
  args: {
    action: storyNewsletterAction,
  },
  decorators: [
    (Story) => (
      <div className="bg-ink p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof NewsletterColumn>

export const Default: Story = {}
