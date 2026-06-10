import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { MailIcon } from './mail-icon'
import { PhoneIcon } from './phone-icon'

const meta: Meta = {
  title: 'Layout/Footer/Icons',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-ink p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="text-paper/75 flex items-center gap-6">
      <PhoneIcon />
      <MailIcon />
    </div>
  ),
}
