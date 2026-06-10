import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Eyebrow } from './eyebrow'

const meta: Meta<typeof Eyebrow> = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['brand', 'muted', 'gold'],
    },
    rule: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Eyebrow>

export const Brand: Story = {
  args: { children: 'Premium Wholesale Teas', tone: 'brand' },
}

export const Muted: Story = {
  args: { children: 'Our Story', tone: 'muted' },
}

export const GoldOnDark: Story = {
  args: { children: 'EST. Melbourne 2014', tone: 'gold' },
  parameters: {
    backgrounds: {
      default: 'dark',
      options: {
        dark: { name: 'dark', value: 'var(--color-ink)' },
      },
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
}

export const NoRule: Story = {
  args: { children: 'Popular Searches', tone: 'muted', rule: false },
}
