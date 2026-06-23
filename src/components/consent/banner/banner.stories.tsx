import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ConsentBanner } from './banner'

const meta: Meta<typeof ConsentBanner> = {
  title: 'Consent/Banner',
  component: ConsentBanner,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ConsentBanner>

export const FirstVisit: Story = {
  args: {
    forceVisible: true,
  },
  render: (args) => (
    <div className="bg-paper min-h-80 p-6">
      <ConsentBanner {...args} />
    </div>
  ),
}
