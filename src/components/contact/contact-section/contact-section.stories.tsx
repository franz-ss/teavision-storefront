import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CONTACT_SECTION_FIXTURE } from '@/components/homepage/content'
import type { ContactActionResult } from '@/lib/contact/types'

import { ContactSection } from './contact-section'

const noopAction = async (): Promise<ContactActionResult> => ({ success: true })

const meta: Meta<typeof ContactSection> = {
  title: 'Contact/ContactSection',
  component: ContactSection,
  tags: ['autodocs'],
  args: {
    action: noopAction,
    intro: CONTACT_SECTION_FIXTURE.intro,
    methods: CONTACT_SECTION_FIXTURE.methods,
  },
}
export default meta

type Story = StoryObj<typeof ContactSection>

export const Default: Story = {
  args: {},
}
