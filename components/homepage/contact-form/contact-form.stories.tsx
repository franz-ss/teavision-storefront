import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomepageContactForm } from './contact-form'

const noopAction = async () => {}

const meta: Meta<typeof HomepageContactForm> = {
  title: 'Homepage/HomepageContactForm',
  component: HomepageContactForm,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}
export default meta

type Story = StoryObj<typeof HomepageContactForm>

export const Default: Story = {
  args: {},
}
