import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Stamp } from './stamp'

const meta = {
  title: 'Homepage/Stamp',
  component: Stamp,
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
} satisfies Meta<typeof Stamp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    top: 'Business',
    bottom: 'Teavision',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Catalogue: Story = {
  args: {
    top: 'Catalog',
    bottom: 'Teavision',
  },
  parameters: {
    backgrounds: { default: 'green' },
  },
}

export const Subscribe: Story = {
  args: {
    top: 'Subscribe',
    bottom: 'Teavision',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
