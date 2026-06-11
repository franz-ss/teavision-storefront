import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SupplyChainProtection } from './supply-chain-protection'

const meta: Meta<typeof SupplyChainProtection> = {
  title: 'Homepage/SupplyChainProtection',
  component: SupplyChainProtection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SupplyChainProtection>

export const Default: Story = {
  args: {},
}
