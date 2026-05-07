import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ExpertsHelp } from './experts-help'

const meta: Meta<typeof ExpertsHelp> = {
  title: 'Homepage/ExpertsHelp',
  component: ExpertsHelp,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ExpertsHelp>

export const Default: Story = {
  args: {},
}
