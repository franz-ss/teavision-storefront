import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { SanitizedHtml } from '@/lib/shopify/html-content'

import { StoryDisclosure } from './story-disclosure'

function sanitized(html: string): SanitizedHtml {
  return html as SanitizedHtml
}

const storyHtml = sanitized(`
  <p>Tea Masters Selection brings together high-grade teas selected for aroma, liquor clarity, and consistent commercial supply.</p>
  <h3>Buying notes</h3>
  <ul>
    <li>Order samples before scaling into bulk packs.</li>
    <li>Use this range for premium menus, gifting, and retail blends.</li>
  </ul>
`)

const meta: Meta<typeof StoryDisclosure> = {
  title: 'Collection/StoryDisclosure',
  component: StoryDisclosure,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof StoryDisclosure>

export const Default: Story = {
  args: {
    title: 'Read more about Tea Masters Selection',
    html: storyHtml,
  },
}

export const Open: Story = {
  args: {
    title: 'Read more about Tea Masters Selection',
    html: storyHtml,
    defaultOpen: true,
  },
}

export const LongUnbrokenTitleMobile: Story = {
  args: {
    title:
      'WholesaleTeaProcurementComplianceSourcingIntelligenceForAustralianBrands',
    html: storyHtml,
    defaultOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Long story disclosure title overflows the mobile canvas')
    }
  },
}
