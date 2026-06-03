import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Contact } from './contact'

const noopAction = async () => ({ success: true })

const meta: Meta<typeof Contact> = {
  title: 'Homepage/Contact',
  component: Contact,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}
export default meta

type Story = StoryObj<typeof Contact>

export const Default: Story = {
  args: {},
}
