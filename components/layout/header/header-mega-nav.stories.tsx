import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HeaderMegaNav, HeaderMobileMegaNav } from './header-mega-nav'

const meta: Meta<typeof HeaderMegaNav> = {
  title: 'Layout/Header/Mega Nav',
  component: HeaderMegaNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-surface p-8">
        <div className="mx-auto max-w-7xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof HeaderMegaNav>

export const Default: Story = {}

export const Mobile: StoryObj<typeof HeaderMobileMegaNav> = {
  render: () => <HeaderMobileMegaNav />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
