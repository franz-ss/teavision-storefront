import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { QualityColumn } from './quality-column'

const meta: Meta<typeof QualityColumn> = {
  title: 'Layout/Footer/Quality Column',
  component: QualityColumn,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-ink p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof QualityColumn>

export const Default: Story = {}
