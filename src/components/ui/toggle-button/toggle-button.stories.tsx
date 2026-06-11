import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChevronRight } from 'lucide-react'

import { ToggleButton } from './toggle-button'

const meta: Meta<typeof ToggleButton> = {
  title: 'UI/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['chip', 'menuCard', 'menuRow', 'thumbnail'],
    },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof ToggleButton>

export const Chip: Story = {
  args: {
    children: 'English Breakfast',
    pressed: false,
    variant: 'chip',
  },
}

export const ChipSelected: Story = {
  args: {
    children: 'English Breakfast',
    pressed: true,
    variant: 'chip',
  },
}

export const MenuCard: Story = {
  args: {
    pressed: true,
    variant: 'menuCard',
    children: (
      <>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="type-label">Tea</span>
          <span className="type-caption text-ink-soft">
            Explore black tea, green tea, matcha, and specialty blends.
          </span>
        </span>
        <span className="border-hairline-2 bg-card text-brand mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border">
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </span>
      </>
    ),
  },
}

export const MenuRow: Story = {
  args: {
    children: (
      <>
        Tea Bags
        <ChevronRight className="size-4" aria-hidden="true" />
      </>
    ),
    pressed: false,
    variant: 'menuRow',
  },
}

export const Thumbnail: Story = {
  args: {
    'aria-label': 'View image 1',
    children: <span className="bg-card block size-full" />,
    pressed: true,
    variant: 'thumbnail',
  },
}
