import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TextInput } from './text-input'

const meta: Meta<typeof TextInput> = {
  title: 'UI/TextInput',
  component: TextInput,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    'aria-label': 'Email address',
    inputMode: 'email',
    placeholder: 'you@brand.com',
    type: 'email',
  },
}
