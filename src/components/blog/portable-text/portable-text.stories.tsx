import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type {
  SanityPortableTextBlock,
  SanityPortableTextTableCell,
} from '@/lib/sanity/types'

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

function tableCell(text: string | null): SanityPortableTextTableCell {
  return { text }
}

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
] satisfies SanityPortableTextBlock[]

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
        _id: 'image-blog-hero-webp',
        url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=1200',
        metadata: {
          dimensions: {
            width: 1200,
            height: 800,
            aspectRatio: 1.5,
          },
          lqip: null,
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
] satisfies SanityPortableTextBlock[]

const HEADING_LEVELS_BODY = [
  {
    _type: 'block',
    _key: 'authored-h1',
    style: 'h1',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'authored-h1-text',
        text: 'Authored H1 Becomes Section Heading',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'authored-h3',
    style: 'h3',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'authored-h3-text',
        text: 'Blending Program',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'authored-h4',
    style: 'h4',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'authored-h4-text',
        text: 'Origin Detail',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'authored-h5',
    style: 'h5',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'authored-h5-text',
        text: 'Compact Sourcing Note',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'authored-h6',
    style: 'h6',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'authored-h6-text',
        text: 'QA Label',
        marks: [],
      },
    ],
  },
] satisfies SanityPortableTextBlock[]

const TABLE_BODY = [
  {
    _type: 'block',
    _key: 'table-intro',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'table-intro-text',
        text: 'Tables should keep buying details scannable on wide and narrow screens.',
        marks: [],
      },
    ],
  },
  {
    _type: 'table',
    _key: 'spec-table',
    caption: 'Tea Specification Table',
    rows: [
      {
        _key: 'table-header',
        cells: [
          tableCell('Format'),
          tableCell('Typical use'),
          tableCell('MOQ'),
          tableCell('Lead time'),
          tableCell('Notes'),
        ],
      },
      {
        _key: 'loose-leaf-row',
        cells: [
          tableCell('Loose Leaf'),
          tableCell('Retail tins and refill pouches'),
          tableCell('25 kg'),
          tableCell('10 business days'),
          tableCell('Blend code printed on carton labels'),
        ],
      },
      {
        _key: 'private-label-row',
        cells: [
          tableCell('Private Label Sachets'),
          tableCell('Food service and hospitality'),
          tableCell('50,000 units'),
          tableCell('4 weeks'),
          tableCell('Artwork approval required before production'),
        ],
      },
      {
        _key: 'empty-cell-row',
        cells: [
          tableCell('Sample Pack'),
          tableCell('Buyer trial'),
          tableCell(''),
          tableCell('5 business days'),
          tableCell(null),
        ],
      },
    ],
  },
] satisfies SanityPortableTextBlock[]

const CAPTIONLESS_TABLE_BODY = [
  {
    _type: 'table',
    _key: 'captionless-table',
    rows: [
      {
        _key: 'captionless-header',
        cells: [tableCell('Lot'), tableCell('Status'), tableCell('Notes')],
      },
      {
        _key: 'captionless-row',
        cells: [tableCell('A-104'), tableCell('Approved'), tableCell('')],
      },
    ],
  },
] satisfies SanityPortableTextBlock[]

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
] satisfies SanityPortableTextBlock[]

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
] satisfies SanityPortableTextBlock[]

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

export const HeadingLevels: Story = {
  args: {
    value: HEADING_LEVELS_BODY,
    className: 'mx-auto max-w-prose',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('heading', { level: 1 })).toBeNull()
    await expect(
      canvas.getByRole('heading', {
        level: 2,
        name: 'Authored H1 Becomes Section Heading',
      }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Blending Program' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('heading', { level: 4, name: 'Origin Detail' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('heading', {
        level: 5,
        name: 'Compact Sourcing Note',
      }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('heading', { level: 6, name: 'QA Label' }),
    ).toBeInTheDocument()
  },
}

export const WithTable: Story = {
  args: {
    value: TABLE_BODY,
    className: 'mx-auto max-w-prose',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('table', { name: 'Tea Specification Table' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('cell', { name: 'Format' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('cell', { name: 'Private Label Sachets' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByText('Blend code printed on carton labels'),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('table', { name: 'Tea Specification Table' })
        .parentElement,
    ).toHaveAttribute('tabindex', '0')
  },
}

export const CaptionlessTable: Story = {
  args: {
    value: CAPTIONLESS_TABLE_BODY,
    className: 'mx-auto max-w-prose',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table')

    await expect(table).toBeInTheDocument()
    await expect(canvas.getByRole('cell', { name: 'Lot' })).toBeInTheDocument()
    await expect(
      canvas.getByRole('cell', { name: 'A-104' }),
    ).toBeInTheDocument()
    await expect(table.parentElement).toHaveAttribute('tabindex', '0')
    await expect(table.parentElement).not.toHaveAttribute('role')
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
