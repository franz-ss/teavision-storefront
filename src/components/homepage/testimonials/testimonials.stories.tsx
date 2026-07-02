import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TESTIMONIALS_FIXTURE } from '../content'
import { Testimonials } from './testimonials'

const meta: Meta<typeof Testimonials> = {
  title: 'Homepage/Testimonials',
  component: Testimonials,
  tags: ['autodocs'],
  args: TESTIMONIALS_FIXTURE,
}
export default meta

type Story = StoryObj<typeof Testimonials>

export const Default: Story = {
  args: {},
}
