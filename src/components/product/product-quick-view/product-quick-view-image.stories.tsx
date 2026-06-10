import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProductQuickViewImage } from './product-quick-view-image'

const meta: Meta<typeof ProductQuickViewImage> = {
  title: 'Product/ProductQuickViewImage',
  component: ProductQuickViewImage,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="relative aspect-[1/1.05] w-80 overflow-hidden rounded-lg bg-paper-2">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ProductQuickViewImage>

export const Default: Story = {
  args: {
    title: 'Tea Masters Sencha Green Tea',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
      altText: 'Loose leaf green tea',
      width: 900,
      height: 900,
    },
  },
}

export const MissingImage: Story = {
  args: {
    title: 'Tea Masters Sencha Green Tea',
    image: null,
  },
}
