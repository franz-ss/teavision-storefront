import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LoadingSkeleton } from './loading-skeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Collection/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof LoadingSkeleton>

export const Default: Story = {
  args: {},
}

export const Compact: Story = {
  args: {
    productCount: 4,
    sidebarRowCount: 3,
  },
}
