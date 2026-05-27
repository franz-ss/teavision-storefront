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

export const WithItems: Story = {
  args: {
    count: 3,
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
