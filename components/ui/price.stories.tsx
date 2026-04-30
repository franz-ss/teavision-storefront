import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Price } from './price'

const meta: Meta<typeof Price> = {
  title: 'UI/Price',
  component: Price,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Price>

export const Standard: Story = {
  args: { price: { amount: '18.00', currencyCode: 'AUD' } },
}

export const Sale: Story = {
  args: {
    price: { amount: '42.00', currencyCode: 'AUD' },
    compareAtPrice: { amount: '52.00', currencyCode: 'AUD' },
  },
}

export const Large: Story = {
  args: { price: { amount: '180.00', currencyCode: 'AUD' }, size: 'lg' },
}

export const Small: Story = {
  args: { price: { amount: '18.00', currencyCode: 'AUD' }, size: 'sm' },
}
