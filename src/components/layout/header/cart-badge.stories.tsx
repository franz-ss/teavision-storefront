import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CartBadge } from './cart-badge'

const meta: Meta<typeof CartBadge> = {
  title: 'Layout/Header/Cart Badge',
  component: CartBadge,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative inline-flex size-11 items-center justify-center">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof CartBadge>

/**
 * Gold round badge — shown when the cart has items.
 * Uses `bg-gold text-ink font-mono` for the new design system.
 */
export const WithItems: Story = {
  args: {
    count: 3,
  },
}

export const HighCount: Story = {
  args: {
    count: 12,
  },
}

export const ZeroHidden: Story = {
  args: {
    count: 0,
  },
  play: ({ canvasElement }) => {
    if (canvasElement.textContent?.includes('items in cart')) {
      throw new Error('Zero cart badge should not render visible content')
    }
  },
}
