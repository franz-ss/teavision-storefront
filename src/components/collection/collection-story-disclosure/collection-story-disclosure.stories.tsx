import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { SanitizedHtml } from '@/lib/shopify/html-content'

import { CollectionStoryDisclosure } from './collection-story-disclosure'

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

const meta: Meta<typeof CollectionStoryDisclosure> = {
  title: 'Collection/CollectionStoryDisclosure',
  component: CollectionStoryDisclosure,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CollectionStoryDisclosure>

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
