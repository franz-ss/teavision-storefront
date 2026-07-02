import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ORGANIC_HERBS_FIXTURE } from '../content'
import { OrganicHerbs } from './organic-herbs'

const meta: Meta<typeof OrganicHerbs> = {
  title: 'Homepage/OrganicHerbs',
  component: OrganicHerbs,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: ORGANIC_HERBS_FIXTURE,
}
export default meta

type Story = StoryObj<typeof OrganicHerbs>

export const Default: Story = {
  args: {},
}
