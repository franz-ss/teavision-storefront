import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SUPPLY_CHAIN_FIXTURE } from '../content'
import { SupplyChain } from './supply-chain'

const meta: Meta<typeof SupplyChain> = {
  title: 'Homepage/SupplyChain',
  component: SupplyChain,
  tags: ['autodocs'],
  args: SUPPLY_CHAIN_FIXTURE,
}
export default meta

type Story = StoryObj<typeof SupplyChain>

export const Default: Story = {
  args: {},
}
