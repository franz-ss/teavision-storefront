import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Dialog } from './dialog'

const meta: Meta<typeof Dialog> = {
  title: 'Ui/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    open: true,
    title: 'Quick View',
    description: 'Preview product details without leaving the page.',
    children: (
      <div className="p-5">
        <p className="type-body-sm text-ink-soft">
          Dialog content remains keyboard accessible and restores focus when
          closed.
        </p>
      </div>
    ),
  },
}
