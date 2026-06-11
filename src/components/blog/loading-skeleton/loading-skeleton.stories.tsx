import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { BlogLoadingSkeleton } from './loading-skeleton'

const meta: Meta<typeof BlogLoadingSkeleton> = {
  title: 'Blog/BlogLoadingSkeleton',
  component: BlogLoadingSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof BlogLoadingSkeleton>

export const Default: Story = {
  args: {},
}

export const WithoutFeatured: Story = {
  args: {
    includeFeatured: false,
  },
}

export const FullPageHandoff: Story = {
  args: {
    includeHero: true,
  },
}
