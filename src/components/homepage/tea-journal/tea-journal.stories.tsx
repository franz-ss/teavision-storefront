import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TeaJournal } from './tea-journal'

const meta: Meta<typeof TeaJournal> = {
  title: 'Homepage/TeaJournal',
  component: TeaJournal,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TeaJournal>

export const Default: Story = {
  args: {},
}
