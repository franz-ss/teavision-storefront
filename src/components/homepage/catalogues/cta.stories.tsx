import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Cta } from './cta'

const meta: Meta<typeof Cta> = {
  title: 'Homepage/Catalogues',
  component: Cta,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Cta>

export const Default: Story = {
  args: {
    intro: {
      eyebrow: 'Catalogue',
      title: 'Download the wholesale catalogue',
      copy: 'Review organic teas, herbs, spices, and custom blending options for commercial programs.',
    },
    cta: {
      href: '/collections',
      children: 'View catalogue',
    },
  },
}
