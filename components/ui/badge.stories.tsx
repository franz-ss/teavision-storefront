import type { Meta, StoryObj } from '@storybook/react'
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

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge variant="sale" />
      <Badge variant="new" />
      <Badge variant="outOfStock" />
    </div>
  ),
}
