import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import { Header } from './view'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof Header>

/**
 * Full header: ink utility bar (EST. MELBOURNE 2014 ticker) + translucent
 * sticky main bar with pill nav, search, and cart affordances.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('link', { name: /apply for wholesale/i }),
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('link', { name: /wholesale account/i }),
    ).not.toBeInTheDocument()
  },
}
