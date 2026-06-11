import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Minus, Plus } from 'lucide-react'

import { IconButton } from './icon-button'

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  args: {
    'aria-label': 'Increase quantity',
    children: <Plus className="size-4" aria-hidden="true" />,
  },
}

export const Small: Story = {
  args: {
    'aria-label': 'Decrease quantity',
    children: <Minus className="size-4" aria-hidden="true" />,
    size: 'sm',
  },
}

export const Ghost: Story = {
  args: {
    'aria-label': 'Open menu',
    children: <Plus className="size-4" aria-hidden="true" />,
    variant: 'ghost',
  },
}
