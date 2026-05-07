import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Catalogues } from './catalogues'

const meta: Meta<typeof Catalogues> = {
  title: 'Homepage/Catalogues',
  component: Catalogues,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Catalogues>

export const Default: Story = {
  args: {},
}
