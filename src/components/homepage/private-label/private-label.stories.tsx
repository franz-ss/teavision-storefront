import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PrivateLabel } from './private-label'

const meta: Meta<typeof PrivateLabel> = {
  title: 'Homepage/PrivateLabel',
  component: PrivateLabel,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PrivateLabel>

export const Default: Story = {
  args: {},
}
