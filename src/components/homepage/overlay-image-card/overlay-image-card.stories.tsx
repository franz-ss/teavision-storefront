import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PRODUCT_RANGE_FIXTURE } from '../content'
import { OverlayImageCard } from './overlay-image-card'

const meta: Meta<typeof OverlayImageCard> = {
  title: 'Homepage/OverlayImageCard',
  component: OverlayImageCard,
  tags: ['autodocs'],
  args: {
    card: PRODUCT_RANGE_FIXTURE[0],
  },
}
export default meta

type Story = StoryObj<typeof OverlayImageCard>

export const Default: Story = {
  args: {},
}
