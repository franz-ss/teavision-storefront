import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PRODUCT_RANGE } from '../content'
import { OverlayImageCard } from './overlay-image-card'

const meta: Meta<typeof OverlayImageCard> = {
  title: 'Homepage/OverlayImageCard',
  component: OverlayImageCard,
  tags: ['autodocs'],
  args: {
    card: PRODUCT_RANGE[0],
  },
}
export default meta

type Story = StoryObj<typeof OverlayImageCard>

export const Default: Story = {
  args: {},
}
