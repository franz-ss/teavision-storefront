import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ContactSection } from './contact-section'

const noopAction = async () => ({ success: true })

const meta: Meta<typeof ContactSection> = {
  title: 'Contact/ContactSection',
  component: ContactSection,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}
export default meta

type Story = StoryObj<typeof ContactSection>

export const Default: Story = {
  args: {},
}
