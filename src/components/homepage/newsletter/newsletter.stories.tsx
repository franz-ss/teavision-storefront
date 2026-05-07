import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomepageNewsletter } from './newsletter'

const noopAction = async () => {}

const meta: Meta<typeof HomepageNewsletter> = {
  title: 'Homepage/HomepageNewsletter',
  component: HomepageNewsletter,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}
export default meta

type Story = StoryObj<typeof HomepageNewsletter>

export const Default: Story = {
  args: {},
}
