import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProductRange } from './product-range'

const meta: Meta<typeof ProductRange> = {
  title: 'Homepage/ProductRange',
  component: ProductRange,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProductRange>

export const Default: Story = {
  args: {},
}
