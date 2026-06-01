import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { BOTTOM_LINK_CLASS, FooterTextLink, MENU_LINK_CLASS } from './text-link'

const meta: Meta<typeof FooterTextLink> = {
  title: 'Layout/Footer/Text Link',
  component: FooterTextLink,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  args: {
    href: '/collections/wholesale-bulk-tea',
    label: 'Tea',
    className: MENU_LINK_CLASS,
  },
  decorators: [
    (Story) => (
      <div className="bg-footer p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FooterTextLink>

export const Menu: Story = {}

export const Bottom: Story = {
  args: {
    href: '/search',
    label: 'Popular Searches',
    className: BOTTOM_LINK_CLASS,
  },
  decorators: [
    (Story) => (
      <div className="bg-footer-bottom p-6">
        <Story />
      </div>
    ),
  ],
}

export const External: Story = {
  args: {
    href: 'https://mrtea.com.au/account/login',
    label: 'Login',
    title: 'External customer login',
  },
}
