import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { RecommendationCarouselSkeleton } from './recommendation-carousel-skeleton'

const meta: Meta<typeof RecommendationCarouselSkeleton> = {
  title: 'Product/RecommendationCarouselSkeleton',
  component: RecommendationCarouselSkeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RecommendationCarouselSkeleton>

export const Default: Story = {
  args: {},
}

export const TwoCards: Story = {
  args: { count: 2 },
}
