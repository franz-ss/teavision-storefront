import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { ConsentState } from '@/lib/consent/adapter'

import { ConsentPreferences } from './preferences'

const allOptionalDenied = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
  version: 1,
} satisfies ConsentState

const analyticsGranted = {
  essential: true,
  analytics: true,
  marketing: false,
  updatedAt: '2026-06-23T00:00:00.000Z',
  version: 1,
} satisfies ConsentState

const meta: Meta<typeof ConsentPreferences> = {
  title: 'Consent/Preferences',
  component: ConsentPreferences,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ConsentPreferences>

export const AllOptionalDenied: Story = {
  args: {
    initialConsent: allOptionalDenied,
  },
  render: (args) => (
    <div className="bg-paper p-6">
      <ConsentPreferences {...args} />
    </div>
  ),
}

export const AnalyticsGrantedMarketingDenied: Story = {
  args: {
    initialConsent: analyticsGranted,
  },
  render: (args) => (
    <div className="bg-paper p-6">
      <ConsentPreferences {...args} />
    </div>
  ),
}
