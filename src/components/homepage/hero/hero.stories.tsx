import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomepageHero } from './hero'

const meta: Meta<typeof HomepageHero> = {
  title: 'Homepage/HomepageHero',
  component: HomepageHero,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof HomepageHero>

export const Default: Story = {
  args: {},
}
