import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { BulkSavings } from './bulk-savings'

const meta: Meta<typeof BulkSavings> = {
  title: 'Product/BulkSavings',
  component: BulkSavings,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof BulkSavings>

export const NativePriceBreaks: Story = {
  args: {
    basePrice: {
      amount: '24.00',
      currencyCode: 'AUD',
    },
    selectedQuantity: 5,
    tiers: [
      {
        minimumQuantity: 2,
        price: {
          amount: '22.80',
          currencyCode: 'AUD',
        },
      },
      {
        minimumQuantity: 5,
        price: {
          amount: '20.40',
          currencyCode: 'AUD',
        },
      },
      {
        minimumQuantity: 10,
        price: {
          amount: '18.00',
          currencyCode: 'AUD',
        },
      },
    ],
  },
}

export const FallbackPercentTiers: Story = {
  args: {
    basePrice: {
      amount: '32.50',
      currencyCode: 'AUD',
    },
    selectedQuantity: 3,
    tiers: [
      {
        minimumQuantity: 3,
        discountPercent: 5,
        label: 'Starter carton',
      },
      {
        minimumQuantity: 6,
        discountPercent: 10,
        label: 'Cafe carton',
      },
      {
        minimumQuantity: 12,
        discountPercent: 15,
        label: 'Wholesale carton',
      },
    ],
  },
}
