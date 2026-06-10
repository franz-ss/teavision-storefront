import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'outOfStock',
        'sale',
        'new',
        'certification',
        'organic',
        'gold',
        'onDark',
      ],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const OutOfStock: Story = { args: { variant: 'outOfStock' } }
export const Sale: Story = { args: { variant: 'sale' } }
export const New: Story = { args: { variant: 'new' } }

export const Certification: Story = {
  args: { variant: 'certification', label: 'ACO' },
}

export const CertificationOrganic: Story = {
  args: { variant: 'certification', label: 'Organic' },
}

export const Organic: Story = {
  args: { variant: 'organic', label: 'Organic' },
}

export const Gold: Story = {
  args: { variant: 'gold', label: 'Award' },
}

export const OnDark: Story = {
  args: { variant: 'onDark', label: 'Wholesale' },
  parameters: {
    backgrounds: {
      default: 'dark',
      options: {
        dark: { name: 'dark', value: 'var(--color-ink)' },
      },
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="sale" />
      <Badge variant="new" />
      <Badge variant="outOfStock" />
      <Badge variant="certification" label="ACO" />
      <Badge variant="certification" label="Organic" />
      <Badge variant="organic" label="Organic" />
      <Badge variant="gold" label="Award Winner" />
    </div>
  ),
}
