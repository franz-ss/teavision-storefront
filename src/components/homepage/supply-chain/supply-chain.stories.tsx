import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SupplyChain } from './supply-chain'

const meta: Meta<typeof SupplyChain> = {
  title: 'Homepage/SupplyChain',
  component: SupplyChain,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SupplyChain>

export const Default: Story = {
  args: {},
}
