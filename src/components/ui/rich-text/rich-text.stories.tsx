import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { SanitizedHtml } from '@/lib/shopify/html-content'

import { RichText } from './rich-text'

const meta: Meta<typeof RichText> = {
  title: 'UI/RichText',
  component: RichText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}
export default meta

type Story = StoryObj<typeof RichText>

const LINK_CLASS_NAME =
  'text-brand hover:text-brand-deep focus-visible:ring-ring rounded underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const TEXT_SAMPLE =
  'Teavision blends botanical sourcing, compliance detail, and production know-how for wholesale tea programs.'

const TYPOGRAPHY_TOKENS = [
  {
    name: 'type-display',
    className: 'type-display text-ink',
    sample: 'Wholesale tea, handled end to end',
  },
  {
    name: 'type-heading-01',
    className: 'type-heading-01 text-ink',
    sample: 'Source, blend, pack, and supply',
  },
  {
    name: 'type-heading-02',
    className: 'type-heading-02 text-ink',
    sample: 'Shopify page heading',
  },
  {
    name: 'type-heading-03',
    className: 'type-heading-03 text-ink',
    sample: 'Section heading',
  },
  {
    name: 'type-heading-04',
    className: 'type-heading-04 text-ink',
    sample: 'Nested content heading',
  },
  {
    name: 'type-heading-05',
    className: 'type-heading-05 text-ink',
    sample: 'Compact content heading',
  },
  {
    name: 'type-body-lg',
    className: 'type-body-lg text-ink',
    sample: TEXT_SAMPLE,
  },
  {
    name: 'type-body',
    className: 'type-body text-ink',
    sample: TEXT_SAMPLE,
  },
  {
    name: 'type-body-sm',
    className: 'type-body-sm text-ink',
    sample: TEXT_SAMPLE,
  },
  {
    name: 'type-label',
    className: 'type-label text-ink',
    sample: 'Certified organic range',
  },
  {
    name: 'type-caption',
    className: 'type-caption text-ink-soft',
    sample: 'Updated from Shopify page content',
  },
  {
    name: 'type-eyebrow',
    className: 'type-eyebrow text-brand',
    sample: 'Shopify rich text',
  },
  {
    name: 'type-mono-meta',
    className: 'type-mono-meta text-ink-faint',
    sample: 'Origin · Grade · Format',
  },
] as const

function sanitized(html: string): SanitizedHtml {
  return html as SanitizedHtml
}

function TypographyTokenRow({
  className,
  name,
  sample,
}: {
  className: string
  name: string
  sample: string
}) {
  return (
    <div className="border-hairline grid gap-3 border-t py-6 md:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="type-caption text-ink-soft pt-1">{name}</div>
      <p className={className}>{sample}</p>
    </div>
  )
}

export const TypographyTokens: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl">
      <div className="border-hairline border-b pb-6">
        <p className="type-eyebrow text-brand">Design system</p>
        <h1 className="type-heading-02 text-ink mt-3">
          Typography token scale
        </h1>
      </div>

      <div>
        {TYPOGRAPHY_TOKENS.map((token) => (
          <TypographyTokenRow key={token.name} {...token} />
        ))}
      </div>
    </div>
  ),
}

export const ShopifyPageTypography: Story = {
  args: {
    variant: 'page',
    html: sanitized(`
      <h2 class="type-heading-02 text-ink mt-10">H2 Shopify page section</h2>
      <p class="type-body text-ink">Paragraph text uses the body token. It should be readable across long-form Shopify pages and support <strong>strong text</strong>, <em>emphasis</em>, and <a class="${LINK_CLASS_NAME}" href="https://www.teavision.com.au" target="_blank" rel="noopener noreferrer">inline links</a>.</p>
      <h3 class="type-heading-03 text-ink mt-8">H3 supporting section</h3>
      <p class="type-body text-ink">This level is common for page subsections, compliance notes, and service descriptions.</p>
      <h4 class="type-heading-04 text-ink mt-8">H4 nested detail</h4>
      <p class="type-body text-ink">Nested details should still feel connected to the surrounding copy.</p>
      <h5 class="type-heading-05 text-ink mt-6">H5 compact callout</h5>
      <p class="type-body text-ink">Use this level for smaller authored headings inside dense content.</p>
      <h6 class="type-label text-ink mt-6">H6 label heading</h6>
      <p class="type-body text-ink">The final heading level maps to the label token.</p>
    `),
  },
}

export const ShopifyArticleTypography: Story = {
  args: {
    variant: 'article',
    html: sanitized(`
      <h2 class="type-heading-02 text-ink mt-10">Tea journal heading</h2>
      <p class="type-body text-ink">Article bodies use the same long-form scale as pages so Shopify-authored journal content keeps a steady rhythm.</p>
      <blockquote class="type-body-lg text-ink rounded-lg border border-hairline bg-card p-5 italic">A well-shaped quote should stand apart without leaving the typography system.</blockquote>
      <h3 class="type-heading-03 text-ink mt-8">List styling</h3>
      <ul class="list-disc pl-6">
        <li class="type-body text-ink pl-1">Loose leaf sourcing and origin notes</li>
        <li class="type-body text-ink pl-1">Blending, packing, and fulfilment details</li>
      </ul>
      <ol class="list-decimal pl-6">
        <li class="type-body text-ink pl-1">Confirm specification</li>
        <li class="type-body text-ink pl-1">Prepare production brief</li>
      </ol>
    `),
  },
}

export const CompactTypography: Story = {
  args: {
    variant: 'compact',
    html: sanitized(`
      <h2 class="type-heading-04 text-ink mt-6">Compact H2</h2>
      <p class="type-body-sm text-ink">Compact rich text supports collection summaries, product descriptions, and disclosures.</p>
      <h3 class="type-heading-05 text-ink mt-5">Compact H3</h3>
      <p class="type-body-sm text-ink">The smaller scale keeps secondary content tidy.</p>
      <h4 class="type-label text-ink mt-5">Compact H4</h4>
      <h5 class="type-label text-ink mt-4">Compact H5</h5>
      <h6 class="type-label text-ink mt-4">Compact H6</h6>
      <ul class="list-disc pl-6">
        <li class="type-body-sm text-ink pl-1">Short disclosure line one</li>
        <li class="type-body-sm text-ink pl-1">Short disclosure line two</li>
      </ul>
    `),
    className: 'max-w-prose',
  },
}

export const TableContent: Story = {
  args: {
    html: sanitized(`
      <h2 class="type-heading-02 text-ink mt-10">Specification table</h2>
      <table class="my-8 block w-full overflow-x-auto border-collapse">
        <caption class="type-body-sm text-ink-soft mb-3">Example merchant table from Shopify</caption>
        <thead>
          <tr><th class="type-label border border-hairline bg-paper-2 p-3 text-left align-top" scope="col">Grade</th><th class="type-label border border-hairline bg-paper-2 p-3 text-left align-top" scope="col">Origin</th><th class="type-label border border-hairline bg-paper-2 p-3 text-left align-top" scope="col">Use</th></tr>
        </thead>
        <tbody>
          <tr><td class="type-body-sm border border-hairline p-3 align-top">Organic</td><td class="type-body-sm border border-hairline p-3 align-top">Sri Lanka</td><td class="type-body-sm border border-hairline p-3 align-top">Blends and infusions</td></tr>
          <tr><td class="type-body-sm border border-hairline p-3 align-top">Conventional</td><td class="type-body-sm border border-hairline p-3 align-top">India</td><td class="type-body-sm border border-hairline p-3 align-top">Bulk supply</td></tr>
        </tbody>
      </table>
    `),
    className: 'max-w-prose',
  },
}

export const MediaContent: Story = {
  args: {
    html: sanitized(`
      <figure class="my-8">
        <img class="my-8 h-auto max-w-full rounded-lg border border-hairline" src="https://cdn.shopify.com/s/files/1/0000/0001/files/tea.jpg" alt="Loose leaf tea" loading="lazy" width="1200" height="800" />
        <figcaption class="type-body-sm text-ink-soft mt-3">Merchant supplied imagery should stay responsive.</figcaption>
      </figure>
    `),
    className: 'max-w-prose',
  },
}

export const LongContent: Story = {
  args: {
    html: sanitized(`
      <p class="type-body text-ink">VeryLongUnbrokenMerchantPastedStringVeryLongUnbrokenMerchantPastedStringVeryLongUnbrokenMerchantPastedString</p>
      <p class="type-body text-ink"><a class="${LINK_CLASS_NAME}" href="https://example.com/a/really/really/really/really/really/long/path">A long pasted URL should wrap instead of breaking layout.</a></p>
    `),
    className: 'max-w-prose',
  },
}
