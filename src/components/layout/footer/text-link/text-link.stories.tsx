import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FooterTextLink } from './text-link'

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

type Story = StoryObj<typeof FooterTextLink>

export const Menu: Story = {}

export const External: Story = {
  args: {
    href: 'https://mrtea.com.au/account/login',
    label: 'Login',
    title: 'External customer login',
  },
}
