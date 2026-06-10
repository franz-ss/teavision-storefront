import type { Meta, StoryObj } from '@storybook/nextjs-vite'

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
      <div className="bg-paper p-6">
        <div className="border-hairline-2 bg-card mx-auto max-w-3xl rounded-lg border p-5 sm:p-6">
          <Story />
        </div>
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
