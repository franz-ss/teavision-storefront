import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { MAIN_MENU_LINKS } from '../data'
import { FooterLinkList } from './link-list'

const meta: Meta<typeof FooterLinkList> = {
  title: 'Layout/Footer/Link List',
  component: FooterLinkList,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  args: {
    title: 'Main Menu',
    links: MAIN_MENU_LINKS,
  },
  decorators: [
    (Story) => (
      <div className="bg-ink p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FooterLinkList>

export const Default: Story = {}
