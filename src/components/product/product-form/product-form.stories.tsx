import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type {
  BulkPricingTier,
  ProductOption,
  ProductVariant,
} from '@/lib/shopify/types'

import { ProductForm } from './product-form'

const options: ProductOption[] = [
  {
    name: 'Pack size',
    values: ['50g Sample', '1kg', '5kg'],
  },
]

const baseVariant: ProductVariant = {
  id: 'gid://shopify/ProductVariant/organic-chamomile-1kg',
  title: 'Default Title',
  availableForSale: true,
  quantityAvailable: 12,
  quantityRule: {
    minimum: 1,
    maximum: 12,
    increment: 1,
  },
  price: { amount: '24.00', currencyCode: 'AUD' },
  quantityPriceBreaks: [],
  image: null,
}

const multiVariants: ProductVariant[] = [
  {
    ...baseVariant,
    id: 'gid://shopify/ProductVariant/organic-chamomile-50g',
    title: '50g Sample',
    quantityAvailable: 8,
    price: { amount: '12.00', currencyCode: 'AUD' },
  },
  {
    ...baseVariant,
    id: 'gid://shopify/ProductVariant/organic-chamomile-1kg',
    title: '1kg',
    quantityAvailable: 6,
    price: { amount: '88.00', currencyCode: 'AUD' },
  },
  {
    ...baseVariant,
    id: 'gid://shopify/ProductVariant/organic-chamomile-5kg',
    title: '5kg',
    availableForSale: false,
    quantityAvailable: 0,
    price: { amount: '390.00', currencyCode: 'AUD' },
  },
]

const bulkPricingTiers: BulkPricingTier[] = [
  {
    minimumQuantity: 2,
    price: { amount: '22.80', currencyCode: 'AUD' },
  },
  {
    minimumQuantity: 5,
    price: { amount: '20.40', currencyCode: 'AUD' },
  },
  {
    minimumQuantity: 10,
    price: { amount: '18.00', currencyCode: 'AUD' },
  },
]

const meta: Meta<typeof ProductForm> = {
  title: 'Product/ProductForm',
  component: ProductForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ProductForm>

export const SingleVariant: Story = {
  args: {
    variants: [baseVariant],
    options: [],
    bulkPricingTiers,
  },
}

export const MultipleVariants: Story = {
  args: {
    variants: multiVariants,
    options,
    bulkPricingTiers,
  },
}

export const SoldOut: Story = {
  args: {
    variants: [
      {
        ...baseVariant,
        availableForSale: false,
        quantityAvailable: 0,
      },
    ],
    options: [],
  },
}

export const LimitedQuantity: Story = {
  args: {
    variants: [
      {
        ...baseVariant,
        quantityAvailable: 3,
        quantityRule: {
          minimum: 1,
          maximum: 3,
          increment: 1,
        },
      },
    ],
    options: [],
    bulkPricingTiers,
  },
}

export const NoVariants: Story = {
  args: {
    variants: [],
    options: [],
  },
}
