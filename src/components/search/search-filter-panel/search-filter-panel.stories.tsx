import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SearchFilterPanel } from './search-filter-panel'

const facets = [
  {
    attribute: 'collections',
    label: 'Collections',
    values: [
      {
        id: 'collections:chai',
        label: 'Chai Tea, Loose leaf & Instant',
        count: 9,
        selected: true,
        href: '/search?q=chai',
      },
      {
        id: 'collections:black-teas',
        label: 'Black Teas',
        count: 4,
        selected: false,
        href: '/search?q=chai&filter=collections%3ABlack+Teas',
      },
    ],
  },
  {
    attribute: 'product_type',
    label: 'Product type',
    values: [
      {
        id: 'product_type:tea',
        label: 'Tea',
        count: 12,
        selected: false,
        href: '/search?q=chai&filter=product_type%3ATea',
      },
    ],
  },
]

const meta: Meta<typeof SearchFilterPanel> = {
  title: 'Search/SearchFilterPanel',
  component: SearchFilterPanel,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SearchFilterPanel>

export const Default: Story = {
  args: {
    clearHref: '/search?q=chai',
    facets,
    resultCount: 22,
    selectedFilterCount: 1,
  },
}

export const Empty: Story = {
  args: {
    clearHref: '/search?q=oolong',
    facets: [],
    resultCount: 0,
    selectedFilterCount: 0,
  },
}
