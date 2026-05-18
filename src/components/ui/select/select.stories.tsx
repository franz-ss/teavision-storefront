import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Select } from './select'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    'aria-label': 'Blend category',
    defaultValue: 'Loose-leaf Tea',
  },
  render: (args) => (
    <Select {...args}>
      <option>Loose-leaf Tea</option>
      <option>Herbal and Botanicals</option>
      <option>Pyramid Tea Bags</option>
      <option>Powders and Instant</option>
    </Select>
  ),
}
