import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CollectionStoryDisclosure } from './collection-story-disclosure'

const storyHtml = `
  <p>Tea Masters Selection brings together high-grade teas selected for aroma, liquor clarity, and consistent commercial supply.</p>
  <h3>Buying notes</h3>
  <ul>
    <li>Order samples before scaling into bulk packs.</li>
    <li>Use this range for premium menus, gifting, and retail blends.</li>
  </ul>
`

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
