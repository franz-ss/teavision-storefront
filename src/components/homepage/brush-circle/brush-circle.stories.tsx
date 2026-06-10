import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { BrushCircle } from './brush-circle'

const meta = {
  title: 'Homepage/BrushCircle',
  component: BrushCircle,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'var(--color-ink)' },
        { name: 'green', value: 'var(--color-brand-deep)' },
        { name: 'paper', value: 'var(--color-paper)' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BrushCircle>

export default meta
type Story = StoryObj<typeof meta>

export const Handshake: Story = {
  args: {
    illo: 'handshake',
  },
}

export const Cup: Story = {
  args: {
    illo: 'cup',
  },
}

export const Teapot: Story = {
  args: {
    illo: 'teapot',
  },
}
