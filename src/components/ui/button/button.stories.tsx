import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'brand',
        'primary',
        'secondary',
        'inverse',
        'inverseSecondary',
        'ghost',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'cta'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

const inverseStoryBackgrounds = {
  default: 'dark',
  options: {
    dark: { name: 'dark', value: 'var(--color-ink)' },
  },
}

const inverseStoryGlobals = {
  backgrounds: { value: 'dark' },
}

export const Brand: Story = {
  args: { children: 'Explore Our Teas', variant: 'brand' },
}

export const Primary: Story = {
  args: { children: 'Add to Cart', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Request Sample', variant: 'secondary' },
}

export const Inverse: Story = {
  args: { children: 'Subscribe', variant: 'inverse' },
  globals: inverseStoryGlobals,
  parameters: {
    backgrounds: inverseStoryBackgrounds,
  },
}

export const InverseSecondary: Story = {
  args: { children: 'Download catalogue', variant: 'inverseSecondary' },
  globals: inverseStoryGlobals,
  parameters: {
    backgrounds: inverseStoryBackgrounds,
  },
}

export const Ghost: Story = {
  args: { children: 'Continue shopping', variant: 'ghost' },
}

export const AsLink: Story = {
  args: { children: 'Read Tea Journal', href: '/blogs/tea-journal' },
}

export const Loading: Story = {
  args: { children: 'Adding…', variant: 'primary', isLoading: true },
}

export const Disabled: Story = {
  args: { children: 'Add to Cart', variant: 'primary', disabled: true },
}

export const Small: Story = {
  args: { children: 'Shop All', variant: 'primary', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Shop All Products', variant: 'primary', size: 'lg' },
}

export const CallToAction: Story = {
  args: { children: 'Browse wholesale', variant: 'primary', size: 'cta' },
}

export const AsSubmit: Story = {
  args: { children: 'Submit', variant: 'primary', type: 'submit' },
}
