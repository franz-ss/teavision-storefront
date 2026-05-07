import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChevronDown } from 'lucide-react'

import { DisclosureButton } from './disclosure-button'

const meta: Meta<typeof DisclosureButton> = {
  title: 'UI/DisclosureButton',
  component: DisclosureButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof DisclosureButton>

export const Collapsed: Story = {
  args: {
    'aria-controls': 'story-disclosure-panel',
    'aria-expanded': false,
    children: (
      <>
        Shop
        <ChevronDown className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </>
    ),
  },
}

export const Expanded: Story = {
  args: {
    'aria-controls': 'story-disclosure-panel',
    'aria-expanded': true,
    children: (
      <>
        Services
        <ChevronDown className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </>
    ),
  },
}
