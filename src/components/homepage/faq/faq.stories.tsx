import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FAQ_FIXTURE } from '../content'
import { Faq } from './faq'

const meta: Meta<typeof Faq> = {
  title: 'Homepage/Faq',
  component: Faq,
  tags: ['autodocs'],
  args: FAQ_FIXTURE,
}
export default meta

type Story = StoryObj<typeof Faq>

export const Default: Story = {
  args: {},
}

export const TitledGroup: Story = {
  args: {
    eyebrow: null,
    description: null,
    title: 'General Wholesale Tea Questions',
    tone: 'surface',
  },
}
