import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    'aria-label': 'Project brief',
    placeholder:
      'Flavour direction, preferred format, target market, price point, and launch timeline.',
    rows: 5,
  },
}
