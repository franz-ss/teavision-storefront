import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Skeleton } from './skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: {
    className: 'h-8 w-40',
  },
}

export const TextStack: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
}

export const Media: Story = {
  render: () => <Skeleton className="aspect-4/3 w-full max-w-sm rounded-lg" />,
}
