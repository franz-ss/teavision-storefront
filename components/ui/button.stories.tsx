import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Add to Cart', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Request Sample', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Continue shopping', variant: 'ghost' },
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

export const AsSubmit: Story = {
  args: { children: 'Submit', variant: 'primary', type: 'submit' },
}
