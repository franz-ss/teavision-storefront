import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Testimonials } from './testimonials'

const meta: Meta<typeof Testimonials> = {
  title: 'Homepage/Testimonials',
  component: Testimonials,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Testimonials>

export const Default: Story = {
  args: {},
}
