import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Blog/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}
