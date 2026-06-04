import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="sale" />
      <Badge variant="new" />
      <Badge variant="outOfStock" />
      <Badge variant="certification" label="ACO" />
      <Badge variant="certification" label="Organic" />
    </div>
  ),
}
