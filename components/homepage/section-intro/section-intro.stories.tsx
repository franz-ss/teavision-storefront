import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SectionIntro } from './section-intro'

const meta: Meta<typeof SectionIntro> = {
  title: 'Homepage/SectionIntro',
  component: SectionIntro,
  tags: ['autodocs'],
  args: {
    title: 'Organic Herbs and Botanical Ingredients',
    copy: 'Source botanical ingredients for wholesale tea, beverage, and wellness ranges.',
  },
}
export default meta

type Story = StoryObj<typeof SectionIntro>

export const Default: Story = {
  args: {},
}
