import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProofPoints } from './proof-points'

const meta: Meta<typeof ProofPoints> = {
  title: 'Homepage/ProofPoints',
  component: ProofPoints,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProofPoints>

export const Default: Story = {
  args: {},
}
