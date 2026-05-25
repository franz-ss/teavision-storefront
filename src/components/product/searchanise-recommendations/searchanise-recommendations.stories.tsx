import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SearchaniseRecommendations } from './searchanise-recommendations'

const meta: Meta<typeof SearchaniseRecommendations> = {
  title: 'Product/SearchaniseRecommendations',
  component: SearchaniseRecommendations,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SearchaniseRecommendations>

export const Default: Story = {
  args: {
    fallback: (
      <div className="border-default bg-surface text-default rounded-lg border p-6">
        Native recommendation carousel fallback
      </div>
    ),
    fallbackDelayMs: 0,
    widgetId: '1T8K1Y6Q6G8R3B3',
  },
}
