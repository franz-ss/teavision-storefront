import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { SanitizedHtml } from '@/lib/shopify/html-content'

import { RichText } from './rich-text'

const meta: Meta<typeof RichText> = {
  title: 'UI/RichText',
  component: RichText,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RichText>

const sampleHtml = `
  <h2>Wholesale page body</h2>
  <p>Shopify-authored content can include <strong>rich text</strong>, links, and supporting details.</p>
  <p><a href="https://www.teavision.com.au" target="_blank" rel="noopener noreferrer">External link</a></p>
  <ul>
    <li>Sanitized before render</li>
    <li>Styled through the design system</li>
  </ul>
` as SanitizedHtml

export const Default: Story = {
  args: {
    html: sampleHtml,
    className: 'max-w-prose',
  },
}
