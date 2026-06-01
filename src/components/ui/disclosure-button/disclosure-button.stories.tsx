import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChevronDown } from 'lucide-react'
import { expect, within } from 'storybook/test'

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
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Shop' })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toHaveAttribute(
      'aria-controls',
      'story-disclosure-panel',
    )
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
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Services',
    })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
  },
}

export const Disabled: Story = {
  args: {
    'aria-controls': 'story-disclosure-panel',
    'aria-expanded': false,
    disabled: true,
    children: (
      <>
        Unavailable
        <ChevronDown className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Unavailable',
    })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  },
}

export const FlushLayout: Story = {
  args: {
    'aria-controls': 'story-disclosure-panel',
    'aria-expanded': true,
    className: 'w-full justify-between rounded-none px-4',
    children: (
      <>
        Full-width disclosure
        <ChevronDown className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Full-width disclosure',
    })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveClass('w-full')
  },
}
