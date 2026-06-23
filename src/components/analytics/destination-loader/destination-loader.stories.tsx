import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { grantOptionalConsent } from '@/lib/consent/adapter'

import { AnalyticsDestinationLoader } from './destination-loader'

const meta: Meta<typeof AnalyticsDestinationLoader> = {
  title: 'Analytics/DestinationLoader',
  component: AnalyticsDestinationLoader,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AnalyticsDestinationLoader>

export const Disabled: Story = {
  args: {
    config: {
      analyticsMode: 'disabled',
    },
    initialConsent: grantOptionalConsent(),
  },
  render: (args) => (
    <div className="bg-paper text-ink type-body-sm min-h-32 p-6">
      <AnalyticsDestinationLoader {...args} />
      Analytics destinations are disabled for this story.
    </div>
  ),
}
