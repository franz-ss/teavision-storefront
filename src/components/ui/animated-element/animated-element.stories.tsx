import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AnimatedElement } from './animated-element'

const meta = {
  title: 'UI/AnimatedElement',
  component: AnimatedElement,
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
} satisfies Meta<typeof AnimatedElement>
export default meta

type Story = StoryObj<typeof meta>

export const PrimaryFloat: Story = {
  args: {
    animation: 'float-primary',
    src: '/images/business-handshake.png',
    width: 678,
    height: 594,
    className: 'w-[clamp(188px,23.5vw,252px)]',
    sizes: '(min-width: 1024px) 252px, 40vw',
  },
}

export const SecondaryFloat: Story = {
  args: {
    animation: 'float-secondary',
    src: '/images/business-stamp.png',
    width: 562,
    height: 567,
    className: 'w-[clamp(140px,14vw,200px)]',
    sizes: '(min-width: 1024px) 200px, 30vw',
  },
}
