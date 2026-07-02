import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SUPPLY_CHAIN_PROTECTION_FIXTURE } from '../content'
import { SupplyChainProtection } from './supply-chain-protection'

const meta: Meta<typeof SupplyChainProtection> = {
  title: 'Homepage/SupplyChainProtection',
  component: SupplyChainProtection,
  tags: ['autodocs'],
  args: SUPPLY_CHAIN_PROTECTION_FIXTURE,
}
export default meta

type Story = StoryObj<typeof SupplyChainProtection>

export const Default: Story = {
  args: {},
}
