import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Card } from '@/components/ui'

import { ContactForm } from './contact-form'

const successAction = async () => ({ success: true })
const errorAction = async () => ({
  success: false,
  error: 'Unable to send your message right now. Please try again shortly.',
})

const meta: Meta<typeof ContactForm> = {
  title: 'Contact/ContactForm',
  component: ContactForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6">
        <Card className="mx-auto max-w-3xl" padding="lg" radius="md">
          <Story />
        </Card>
      </div>
    ),
  ],
  args: {
    action: successAction,
  },
}
export default meta

type Story = StoryObj<typeof ContactForm>

export const Default: Story = {}

export const Success: Story = {
  args: {
    action: successAction,
    initialState: 'success',
  },
}

export const Error: Story = {
  args: {
    action: errorAction,
    initialState: 'error',
    initialError:
      'Unable to send your message right now. Please try again shortly.',
  },
}
