import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    defaultChecked: true,
    name: 'flavours',
    value: 'Peach',
  },
  render: (args) => (
    <label className="type-body-sm text-default flex items-center gap-3">
      <Checkbox {...args} />
      <span>Peach</span>
    </label>
  ),
}
