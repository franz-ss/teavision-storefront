import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProductGallery } from './product-gallery'

const MOCK_IMAGE = (i: number) => ({
  url: `https://cdn.shopify.com/s/files/1/0000/0001/products/tea-${i}.jpg?v=1`,
  altText: `Tea product image ${i}`,
  width: 800,
  height: 600,
})

const meta: Meta<typeof ProductGallery> = {
  component: ProductGallery,
  tags: ['autodocs'],
  args: {
    title: 'English Breakfast Tea',
  },
}

export default meta
type Story = StoryObj<typeof ProductGallery>

export const Default: Story = {
  args: {
    images: [MOCK_IMAGE(1), MOCK_IMAGE(2), MOCK_IMAGE(3), MOCK_IMAGE(4)],
  },
}

export const ManyImages: Story = {
  args: {
    images: Array.from({ length: 10 }, (_, i) => MOCK_IMAGE(i + 1)),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
}

export const SingleImage: Story = {
  args: {
    images: [MOCK_IMAGE(1)],
  },
}

export const EmptyState: Story = {
  args: {
    images: [],
  },
}
