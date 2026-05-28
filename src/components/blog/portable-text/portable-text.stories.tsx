import type { PortableTextBlock } from '@portabletext/react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PortableTextContent } from './portable-text'

const meta: Meta<typeof PortableTextContent> = {
  title: 'Blog/PortableTextContent',
  component: PortableTextContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}
export default meta

type Story = StoryObj<typeof PortableTextContent>

const RICH_ARTICLE_BODY = [
  {
    _type: 'block',
    _key: 'intro',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'intro-text',
        text: 'A steady blog renderer keeps Sanity-authored tea education readable, searchable, and aligned with the storefront design system.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'inline-marks',
    style: 'normal',
    markDefs: [
      {
        _key: 'safe-link',
        _type: 'link',
        href: 'https://teavision.com.au/pages/wholesale',
      },
      {
        _key: 'email-link',
        _type: 'link',
        href: 'mailto:sales@teavision.com.au',
      },
    ],
    children: [
      {
        _type: 'span',
        _key: 'inline-start',
        text: 'Wholesale buyers can ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'inline-link',
        text: 'compare private label options',
        marks: ['safe-link'],
      },
      {
        _type: 'span',
        _key: 'inline-middle',
        text: ', request ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'inline-code',
        text: 'organic',
        marks: ['code'],
      },
      {
        _type: 'span',
        _key: 'inline-more',
        text: ' documentation, or ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'inline-email',
        text: 'email the sourcing team',
        marks: ['email-link'],
      },
      {
        _type: 'span',
        _key: 'inline-end',
        text: '.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'heading-text',
        text: 'What buyers need from article content',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'subheading',
    style: 'h3',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'subheading-text',
        text: 'How content supports buying decisions',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'list-one',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'list-one-text',
        text: 'Clear sourcing notes for teas, herbs, and spices',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'list-two',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'list-two-text',
        text: 'Practical guidance that supports wholesale decisions',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'number-one',
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'number-one-text',
        text: 'Confirm the blend format and ingredient declaration.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'number-two',
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'number-two-text',
        text: 'Match pack size to the expected channel and shelf life.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'quote',
    style: 'blockquote',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'quote-text',
        text: 'Editorial content should feel like a calm expert at the table.',
        marks: [],
      },
    ],
  },
] as unknown as PortableTextBlock[]

const MEDIA_BODY = [
  {
    _type: 'block',
    _key: 'media-intro',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'media-intro-text',
        text: 'Inline media should keep editorial rhythm without breaking the article layout.',
        marks: [],
      },
    ],
  },
  {
    _type: 'imageWithAlt',
    _key: 'media-image',
    alt: 'Loose leaf tea being inspected',
    caption: 'Batch review before blending',
    attribution: 'Teavision',
    image: {
      asset: {
        url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=1200',
        metadata: {
          dimensions: {
            width: 1200,
            height: 800,
          },
        },
      },
    },
  },
  {
    _type: 'callout',
    _key: 'callout',
    title: 'Buyer note',
    body: 'Ask for origin, cut size, and microbial documentation before confirming production volumes.',
  },
] as unknown as PortableTextBlock[]

const MISSING_IMAGE_BODY = [
  {
    _type: 'imageWithAlt',
    _key: 'missing-image',
    alt: 'Missing image',
    caption: 'This malformed block should not render a broken image.',
    image: {
      asset: null,
    },
  },
] as unknown as PortableTextBlock[]

const UNSAFE_LINK_BODY = [
  {
    _type: 'block',
    _key: 'unsafe-link',
    style: 'normal',
    markDefs: [
      {
        _key: 'unsafe',
        _type: 'link',
        href: 'javascript:alert("bad")',
      },
    ],
    children: [
      {
        _type: 'span',
        _key: 'unsafe-text',
        text: 'Unsafe CMS links render as plain text.',
        marks: ['unsafe'],
      },
    ],
  },
] as PortableTextBlock[]

export const RichArticleBody: Story = {
  args: {
    value: RICH_ARTICLE_BODY,
    className: 'mx-auto max-w-prose',
  },
}

export const WithMediaAndCallout: Story = {
  args: {
    value: MEDIA_BODY,
    className: 'mx-auto max-w-prose',
  },
}

export const UnsafeLinkIsPlainText: Story = {
  args: {
    value: UNSAFE_LINK_BODY,
    className: 'mx-auto max-w-prose',
  },
}

export const MissingImageAsset: Story = {
  args: {
    value: MISSING_IMAGE_BODY,
    className: 'mx-auto max-w-prose',
  },
}

export const Empty: Story = {
  args: {
    value: [],
    className: 'mx-auto max-w-prose',
  },
}
