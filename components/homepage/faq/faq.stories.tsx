import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Faq } from './faq'

const meta: Meta<typeof Faq> = {
  title: 'Homepage/Faq',
  component: Faq,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Faq>

export const Default: Story = {
  args: {},
}
