import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { OrganicHerbs } from './organic-herbs'

const meta: Meta<typeof OrganicHerbs> = {
  title: 'Homepage/OrganicHerbs',
  component: OrganicHerbs,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof OrganicHerbs>

export const Default: Story = {
  args: {},
}
