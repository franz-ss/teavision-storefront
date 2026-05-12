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
  args: {},
}
