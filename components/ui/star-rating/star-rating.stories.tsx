import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { StarRating } from './star-rating'

const meta: Meta<typeof StarRating> = {
  component: StarRating,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StarRating>

export const FiveStars: Story = { args: { rating: 5, count: 128 } }
export const FourHalf: Story = { args: { rating: 4.5, count: 47 } }
export const Four: Story = { args: { rating: 4, count: 12 } }
export const TwoAndHalf: Story = { args: { rating: 2.5, count: 3 } }
export const NoCount: Story = { args: { rating: 4.8 } }
export const Small: Story = { args: { rating: 4.5, count: 89, size: 'sm' } }
export const Large: Story = { args: { rating: 4.8, count: 234, size: 'lg' } }
