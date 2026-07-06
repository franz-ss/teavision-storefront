# Phase 22: Storefront Data and Rendering - Pattern Map

**Mapped:** 2026-07-02
**Files analyzed:** 40 new/modified targets inferred from CONTEXT.md and RESEARCH.md
**Analogs found:** 40 / 40 have at least role-match analogs

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/sanity/queries/home-page.ts` | utility/query | request-response, transform | `src/lib/sanity/queries/blog.ts` | exact |
| `src/lib/sanity/queries/home-page.test.ts` | test | transform | `src/lib/sanity/queries/blog.test.ts` | exact |
| `src/lib/sanity/types.ts` | model | transform | `src/lib/sanity/types.ts` | exact, existing file |
| `src/lib/sanity/home-page.ts` | service | request-response, transform | `src/lib/blog/operations.ts` | role-match |
| `src/lib/sanity/home-page.test.ts` | test | request-response, transform | `src/lib/blog/operations.test.ts` | role-match |
| `src/app/(storefront)/page.tsx` | route | request-response, server-rendering | `src/app/(storefront)/page.tsx`; `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts` | exact + role-match |
| `src/app/(storefront)/page.test.tsx` | test | request-response, server-rendering | `src/app/(storefront)/products/[handle]/page.test.tsx` | role-match |
| `src/components/homepage/content.ts` | utility/fixture | transform | `src/components/homepage/content.ts` | exact, existing file |
| `src/components/homepage/hero/hero.tsx` | component | server-rendering | `src/components/homepage/hero/hero.tsx` | exact, existing file |
| `src/components/homepage/hero/hero.stories.tsx` | test/story | component interaction | `src/components/homepage/hero/hero.stories.tsx` | exact, existing file |
| `src/components/homepage/proof-points/proof-points.tsx` | component | server-rendering | `src/components/homepage/proof-points/proof-points.tsx`; `src/components/homepage/hero/hero.tsx` | exact, existing file + role-match |
| `src/components/homepage/proof-points/proof-points.stories.tsx` | test/story | component interaction | `src/components/homepage/proof-points/proof-points.stories.tsx`; `src/components/homepage/hero/hero.stories.tsx` | exact, existing file + role-match |
| `src/components/homepage/product-range/product-range.tsx` | component | server-rendering | `src/components/homepage/product-range/product-range.tsx` | exact, existing file |
| `src/components/homepage/product-range/product-range.stories.tsx` | test/story | component interaction | `src/components/homepage/product-range/product-range.stories.tsx` | exact, existing file |
| `src/components/homepage/overlay-image-card/overlay-image-card.tsx` | component | server-rendering | `src/components/homepage/overlay-image-card/overlay-image-card.tsx` | exact, existing file |
| `src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` | test | transform/rendering | `src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` | exact, existing file |
| `src/components/homepage/newsletter/newsletter.tsx` | component | server-rendering, form handoff | `src/components/homepage/newsletter/newsletter.tsx` | exact, existing file |
| `src/components/homepage/newsletter/newsletter.stories.tsx` | test/story | form interaction | `src/components/homepage/newsletter/newsletter.stories.tsx` | exact, existing file |
| `src/components/homepage/private-label/private-label.tsx` | component | server-rendering | `src/components/homepage/private-label/private-label.tsx` | exact, existing file |
| `src/components/homepage/private-label/private-label.stories.tsx` | test/story | component rendering | `src/components/homepage/product-range/product-range.stories.tsx` | role-match |
| `src/components/homepage/organic-herbs/organic-herbs.tsx` | component | server-rendering | `src/components/homepage/organic-herbs/organic-herbs.tsx` | exact, existing file |
| `src/components/homepage/organic-herbs/organic-herbs.stories.tsx` | test/story | component rendering | `src/components/homepage/product-range/product-range.stories.tsx` | role-match |
| `src/components/homepage/supply-chain/supply-chain.tsx` | component | server-rendering | `src/components/homepage/supply-chain/supply-chain.tsx` | exact, existing file |
| `src/components/homepage/supply-chain/supply-chain.stories.tsx` | test/story | component rendering | `src/components/homepage/product-range/product-range.stories.tsx` | role-match |
| `src/components/homepage/certification-coverage/certification-coverage.tsx` | component | server-rendering | `src/components/homepage/certification-coverage/certification-coverage.tsx` | exact, existing file |
| `src/components/homepage/certification-coverage/certification-coverage.stories.tsx` | test/story | component rendering | `src/components/homepage/product-range/product-range.stories.tsx` | role-match |
| `src/components/homepage/supply-chain-protection/supply-chain-protection.tsx` | component | server-rendering | `src/components/homepage/supply-chain-protection/supply-chain-protection.tsx` | exact, existing file |
| `src/components/homepage/supply-chain-protection/supply-chain-protection.stories.tsx` | test/story | component rendering | `src/components/homepage/product-range/product-range.stories.tsx` | role-match |
| `src/components/homepage/testimonials/testimonials.tsx` | component | server-rendering, client-leaf handoff | `src/components/homepage/testimonials/testimonials.tsx` | exact, existing file |
| `src/components/homepage/testimonials/testimonials.stories.tsx` | test/story | component rendering | `src/components/homepage/testimonials/testimonials.stories.tsx` | exact, existing file |
| `src/components/homepage/tea-journal/tea-journal.tsx` | component | request-response, server-rendering | `src/components/homepage/tea-journal/tea-journal.tsx` | exact, existing file |
| `src/components/homepage/tea-journal/tea-journal.stories.tsx` | test/story | component rendering | `src/components/homepage/tea-journal/tea-journal.stories.tsx` | exact, existing file |
| `src/components/contact/contact-section/contact-section.tsx` | component | server-rendering, form handoff | `src/components/contact/contact-section/contact-section.tsx` | exact, existing file |
| `src/components/contact/contact-section/contact-section.stories.tsx` | test/story | component rendering | `src/components/contact/contact-section/contact-section.stories.tsx` | exact, existing file |
| `src/components/homepage/catalogues/cta.tsx` | component | server-rendering | `src/components/homepage/catalogues/cta.tsx` | exact, existing file |
| `src/components/homepage/catalogues/cta.stories.tsx` | test/story | component rendering | `src/components/homepage/catalogues/cta.stories.tsx` | exact, existing file |
| `src/components/homepage/faq/faq.tsx` | component | server-rendering | `src/components/homepage/faq/faq.tsx` | exact, existing file |
| `src/components/homepage/faq/faq.stories.tsx` | test/story | component rendering | `src/components/homepage/faq/faq.stories.tsx` | exact, existing file |

## Pattern Assignments

### `src/lib/sanity/queries/home-page.ts` (utility/query, request-response)

**Analog:** `src/lib/sanity/queries/blog.ts`

**Imports and fragment pattern** (lines 1-33):
```typescript
import { groq } from 'next-sanity'

export const sanityImageWithAltFields = groq`
  alt,
  caption,
  attribution,
  image{
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height,
          aspectRatio
        },
        lqip
      }
    },
    crop,
    hotspot
  }
`

export const sanitySeoFields = groq`
  metaTitle,
  metaDescription,
  canonicalPath,
  noIndex,
  ogImage{
    ${sanityImageWithAltFields}
  }
`
```

**Query composition pattern** (lines 247-255):
```typescript
export const homepageBlogPostsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    blog->slug.current == $blogHandle &&
    publishedAt <= now()
  ] | order(publishedAt desc)[0...3]{
    ${sanityBlogPostSummaryFields}
  }
`
```

Apply this to `home-page.ts`: export reusable fragments for `homeSection`, `homeLink`, authored image fields, SEO fields, and the singleton `homePageQuery`. Reuse `sanityImageWithAltFields` and `sanitySeoFields` directly if planner keeps them exported from `blog.ts`; otherwise move shared Sanity fragments to a neutral file before importing from both query files.

### `src/lib/sanity/types.ts` (model, transform)

**Analog:** `src/lib/sanity/types.ts`

**Raw Sanity image/SEO type pattern** (lines 4-38):
```typescript
export type SanitySeo = {
  metaTitle: string | null
  metaDescription: string | null
  canonicalPath: string | null
  noIndex: boolean | null
  ogImage: SanityImageWithAlt | null
}

export type SanityImageAsset = {
  _id: string
  url: string | null
  metadata: {
    dimensions: SanityImageDimensions | null
    lqip: string | null
  } | null
}

export type SanityImageWithAlt = {
  alt: string | null
  caption: string | null
  attribution: string | null
  image: SanityImage | null
}
```

**Result-shape pattern** (lines 128-157):
```typescript
export type SanityBlogListingResult = {
  blog: SanityBlog | null
  articles: SanityBlogPostSummary[]
}

export type SanityBlogPostResult = {
  article: SanityBlogPost | null
}
```

Add raw homepage result types here, not under generated Shopify types. Keep nullable Sanity fields nullable at the raw boundary; validate and narrow them in `src/lib/sanity/home-page.ts`.

### `src/lib/sanity/home-page.ts` (service, request-response + transform)

**Analog:** `src/lib/blog/operations.ts`

**Imports pattern** (lines 1-24):
```typescript
import type { SanityImageSource } from '@sanity/image-url'
import { cacheLife, cacheTag } from 'next/cache'

import {
  getSanityImageUrl,
  sanityFetch,
} from '@/lib/sanity/client'
import type { SanityImageUrlOptions } from '@/lib/sanity/client'
import type {
  SanityImageWithAlt,
  SanitySeo,
} from '@/lib/sanity/types'
```

**Public view-model types pattern** (lines 33-47, 55-83):
```typescript
export type BlogImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
  lqip?: string | null
}

export type BlogSeo = {
  title: string | null
  description: string | null
  canonicalPath: string | null
  noIndex: boolean
  ogImage: BlogImage | null
}
```

**Image normalization pattern** (lines 113-164):
```typescript
const IMAGE_OPTIONS_HERO: SanityImageUrlOptions = { width: 1920, quality: 75, fit: 'max' }
const IMAGE_OPTIONS_FEATURED_CARD: SanityImageUrlOptions = { width: 900, quality: 75, fit: 'max' }
const IMAGE_OPTIONS_CARD: SanityImageUrlOptions = { width: 640, quality: 68, fit: 'max' }

function reshapeImage(
  image: SanityImageWithAlt | null,
  imageOptions?: SanityImageUrlOptions,
): BlogImage | null {
  const source = image?.image
  const asset = source?.asset
  if (!asset?._id && !asset?.url) return null

  let url = asset.url
  if (asset._id && source) {
    try {
      url = getSanityImageUrl(source as SanityImageSource, imageOptions)
    } catch {
      url = asset.url
    }
  }

  if (!url) return null

  return {
    url,
    altText: image?.alt ?? null,
    width: asset.metadata?.dimensions?.width ?? null,
    height: asset.metadata?.dimensions?.height ?? null,
    lqip: asset.metadata?.lqip ?? null,
  }
}
```

**Cached Sanity operation pattern** (lines 387-421, 532-546):
```typescript
export async function getBlog(handle: string): Promise<BlogIndex | null> {
  'use cache'
  const normalizedHandle = normalizeBlogHandle(handle)
  cacheTag('blog', `blog-${normalizedHandle}`)
  cacheLife('hours')

  const data = await sanityFetch<SanityBlogListingResult>(
    blogListingQuery,
    { blogHandle: normalizedHandle },
  )

  if (!data.blog) return null
  // normalize raw Sanity data into UI-ready data here
}

export async function getHomepageArticles(
  blogHandle = DEFAULT_BLOG_HANDLE,
): Promise<BlogArticleSummary[]> {
  'use cache'
  const normalizedHandle = normalizeBlogHandle(blogHandle)
  cacheTag('blog', `blog-${normalizedHandle}`)
  cacheLife('hours')

  const articles = await sanityFetch<SanityBlogPostSummary[]>(
    homepageBlogPostsQuery,
    { blogHandle: normalizedHandle },
  )

  return articles.map((a) => reshapeArticleSummary(a))
}
```

Planner notes:
- Keep homepage fetch cached: `'use cache'`, `cacheTag('homePage', 'sanity-homepage')`, `cacheLife('hours')`.
- Unlike `getBlog()`, `getHomepage()` must not return `null` for missing required content. It should throw explicit errors for missing singleton, invalid canonical, missing required SEO, missing required image URL/asset, missing alt text, missing dimensions, invalid links, and missing render-critical fields. Per D-03, do not throw solely for section item cardinality differences; keep count/cardinality coverage as seeded fixture and shape assertions in tests.
- Use `getSanityImageUrl()` with bounded options per use case. Hero image must use a 1920-wide/high-quality option; card and mark images should use narrower bounded options.
- Do not import from `src/lib/shopify/types/generated/`; homepage public view-model types belong in this module or an adjacent handwritten type file.

### `src/lib/sanity/home-page.test.ts` (test, request-response + transform)

**Analog:** `src/lib/blog/operations.test.ts`

**Mock setup pattern** (lines 20-32, 72-84):
```typescript
vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}))

vi.mock('@/lib/sanity/client', () => ({
  getSanityImageUrl: vi.fn(),
  sanityFetch: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset()
  vi.mocked(getSanityImageUrl).mockReset()
  vi.mocked(getSanityImageUrl).mockImplementation((_source, options = {}) => {
    const width = options.width ? `w=${options.width}` : null
    const quality = options.quality ? `q=${options.quality}` : null
    const fit = options.fit ? `fit=${options.fit}` : null

    return ['https://cdn.sanity.io/generated.jpg', width, quality, fit]
      .filter((part): part is string => Boolean(part))
      .join('?')
  })
})
```

**Fixture factory pattern** (lines 34-70):
```typescript
function makeImage(id: string, lqip: string | null): SanityImageWithAlt {
  return {
    alt: `${id} alt`,
    attribution: null,
    caption: null,
    image: {
      asset: {
        _id: `image-${id}`,
        url: `https://cdn.sanity.io/images/project/dataset/${id}.jpg`,
        metadata: {
          dimensions: {
            width: 1200,
            height: 800,
            aspectRatio: 1.5,
          },
          lqip,
        },
      },
    },
  }
}
```

**Image option assertion pattern** (lines 87-137):
```typescript
it('carries LQIP and uses bounded image options by listing use case', async () => {
  vi.mocked(sanityFetch).mockResolvedValue(result)

  const listing = await getDefaultBlogListing('teavision-blogs', 1)

  expect(listing?.heroImage).toMatchObject({
    lqip: 'data:image/jpeg;base64,hero',
    url: expect.stringContaining('w=1920'),
  })

  expect(vi.mocked(getSanityImageUrl)).toHaveBeenCalledWith(
    expect.objectContaining({
      asset: expect.objectContaining({ _id: 'image-hero' }),
    }),
    { fit: 'max', quality: 75, width: 1920 },
  )
})
```

Use the same Vitest shape for fail-loud homepage cases: missing document rejects, missing SEO rejects, canonical other than `/` rejects, missing image dimensions rejects, and invalid href rejects. Add seeded fixture/shape assertions for expected section cardinality without requiring runtime rejection solely for cardinality differences.

### `src/lib/sanity/queries/home-page.test.ts` (test, transform)

**Analog:** `src/lib/sanity/queries/blog.test.ts`

**String assertion pattern** (lines 1-36):
```typescript
import { describe, expect, it } from 'vitest'

import {
  blogListingQuery,
  defaultBlogListingQuery,
  sanityBlogPostSummaryLightFields,
} from './blog'

describe('defaultBlogListingQuery', () => {
  it('uses the light article projection without body text', () => {
    expect(sanityBlogPostSummaryLightFields).not.toContain('pt::text(body)')
    expect(sanityBlogPostSummaryLightFields).not.toContain('bodyText')
  })

  it('filters light featured posts to published posts with slugs only', () => {
    expect(defaultBlogListingQuery).toContain(
      '}[defined(slug) && publishedAt <= now()]',
    )
    expect(blogListingQuery).not.toContain(
      '}[defined(slug) && publishedAt <= now()]',
    )
  })
})
```

Use this to assert the homepage query includes the singleton filter, image dimensions/LQIP projection, SEO fields, section fields, and fixed blog config fields.

### `src/app/(storefront)/page.tsx` (route, request-response + server-rendering)

**Analogs:** `src/app/(storefront)/page.tsx`, `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts`, `src/app/(storefront)/collections/[handle]/page.tsx`

**Current route composition pattern to preserve** (homepage lines 45-75):
```tsx
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeInlineJson(websiteJsonLd) }}
      />

      <div className="bg-paper">
        <HomepageHero />
        <ProductRange />
        <HomepageNewsletter action={sendNewsletterSignupAction} />
        <PrivateLabel />
        <OrganicHerbs />
        <SupplyChain />
        <CertificationCoverage />
        <SupplyChainProtection />
        <Testimonials />
        <TeaJournal />
        <ContactSection action={submitContactFormAction} />
        <Cta {...ctaCatalogueData} />
        <Faq />
      </div>
    </>
  )
}
```

**Metadata generation/noindex pattern** (blog metadata lines 18-69):
```typescript
export async function generateListingMetadata({
  params,
  searchParams,
}: ListingProps): Promise<Metadata> {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) return { title: 'Tea Journal' }

  const title = titleParts.join(' | ') || blogData.title
  const description = blogData.seo.description ?? DEFAULT_LISTING_DESCRIPTION

  return withNoindexRobots({
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: blogData.seo.ogImage
        ? [
            {
              url: blogData.seo.ogImage.url,
              alt: blogData.seo.ogImage.altText ?? title,
            },
          ]
        : undefined,
    },
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: !blogData.seo.noIndex }
      : undefined,
  })
}
```

**Dynamic params pattern for Next 16 route reads** (collection lines 26-63):
```typescript
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return withNoindexRobots({ title: 'Collection not found' })

  return withNoindexRobots({
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: heroImage
        ? [
            {
              url: heroImage.url,
              alt: heroImage.altText ?? collection.title,
            },
          ]
        : undefined,
    },
    alternates: { canonical: canonicalPath },
  })
}
```

Planner notes:
- Replace static `metadata` export with `generateMetadata()` that calls cached `getHomepage()`.
- Preserve JSON-LD scripts and `serializeInlineJson()` exactly.
- Keep section order identical.
- Pass CMS content into section props; preserve `sendNewsletterSignupAction` and `submitContactFormAction`.
- Route should fail by thrown data-boundary errors, not by `notFound()` or hidden fallback.

### `src/app/(storefront)/page.test.tsx` (test, request-response + rendering)

**Analog:** `src/app/(storefront)/products/[handle]/page.test.tsx`

**Server route render test pattern** (lines 1-18, 87-96, 112-129):
```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

async function renderProductContent(product: Product) {
  vi.mocked(getProduct).mockResolvedValue(product)

  const element = await ProductContent({
    params: Promise.resolve({ handle: product.handle }),
    searchParams: Promise.resolve({}),
  })

  return renderToStaticMarkup(element as ReactNode)
}

it('keeps the product title as the only H1 and demotes imported description headings', async () => {
  const element = await ProductContent({
    params: Promise.resolve({ handle: 'only-product-title' }),
    searchParams: Promise.resolve({}),
  })
  const html = renderToStaticMarkup(element as ReactNode)

  expect(html.match(/<h1\b/g)).toHaveLength(1)
})
```

**JSON-LD extraction pattern** (lines 63-85, 137-160):
```typescript
type JsonLdNode = Record<string, unknown>

function collectJsonLdNodes(value: unknown): JsonLdNode[] {
  if (Array.isArray(value)) return value.flatMap(collectJsonLdNodes)
  if (typeof value !== 'object' || value === null) return []

  const node = value as JsonLdNode
  const graph = collectJsonLdNodes(node['@graph'])

  return [node, ...graph]
}

function readJsonLdNodes(html: string): JsonLdNode[] {
  return [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g,
    ),
  ].flatMap((match) => collectJsonLdNodes(JSON.parse(match[1] ?? 'null')))
}
```

Use this test shape to assert the homepage uses mocked CMS content, keeps one H1, emits Organization/WebSite JSON-LD, does not contain `HOME_TITLE`/`HOME_DESCRIPTION` fallback strings, and calls `withNoindexRobots()` from metadata generation.

### `src/components/homepage/content.ts` (utility/fixture, transform)

**Analog:** `src/components/homepage/content.ts`

**Existing shared view-model shape** (lines 5-37, 39-50):
```typescript
export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type ProofPoint = {
  icon?: string
  image?: ImageAsset
  title: string
  description: string
}

export type ImageCard = {
  title: string
  href: string
  image: ImageAsset
  action: string
  badge?: ImageAsset
  body?: string
}

export type Testimonial = {
  logo: ImageAsset
  name: string
  role: string
  brand?: string
  quote: string
}
```

**JSON-LD constants to keep code-owned** (lines 75-102):
```typescript
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teavision',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1300-729-617',
    contactType: 'sales',
    areaServed: 'AU',
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Teavision',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}
```

Planner notes:
- Static homepage constants can remain as Storybook/test fixture data only.
- Runtime `src/app/(storefront)/page.tsx` must stop importing static section content.
- JSON-LD constants are explicitly code-owned and can stay here or move to a small SEO constants module.

### Homepage Component Prop-Enable Targets (component, server-rendering)

**Applies to:**
- `src/components/homepage/hero/hero.tsx`
- `src/components/homepage/product-range/product-range.tsx`
- `src/components/homepage/overlay-image-card/overlay-image-card.tsx`
- `src/components/homepage/newsletter/newsletter.tsx`
- `src/components/homepage/private-label/private-label.tsx`
- `src/components/homepage/organic-herbs/organic-herbs.tsx`
- `src/components/homepage/supply-chain/supply-chain.tsx`
- `src/components/homepage/certification-coverage/certification-coverage.tsx`
- `src/components/homepage/supply-chain-protection/supply-chain-protection.tsx`
- `src/components/homepage/testimonials/testimonials.tsx`
- `src/components/homepage/tea-journal/tea-journal.tsx`
- `src/components/homepage/catalogues/cta.tsx`
- `src/components/homepage/faq/faq.tsx`
- `src/components/contact/contact-section/contact-section.tsx`

**Component import/anatomy pattern** (docs/conventions lines 67-79):
```text
1. 'use client' directive - only if needed
2. External imports - react, next/*, npm packages
3. Internal imports - @/lib/*, @/components/*
4. Relative imports - ./foo, ../bar
5. Type definitions
6. Module-level constants
7. Component function
8. Foo.displayName - only for React.forwardRef
9. No default export
```

**Props-first component pattern** (CTA lines 1-17):
```typescript
import {
  AnimatedElement,
  Button,
  ButtonProps,
  Eyebrow,
  Section,
  type SectionIntroProps,
  type SectionRootProps,
} from '@/components/ui'

export interface CtaProps {
  tone?: SectionRootProps['tone']
  intro: SectionIntroProps
  cta: ButtonProps
}

export function Cta({ tone, intro, cta }: CtaProps) {
```

**Optional props/default fixture pattern** (FAQ lines 8-26):
```typescript
type FaqProps = Pick<SectionRootProps, 'className' | 'spacing' | 'tone'> & {
  items?: FaqItem[]
  eyebrow?: string | null
  title?: string
  description?: string | null
}

export function Faq({
  className,
  description = DEFAULT_DESCRIPTION,
  eyebrow = 'Questions',
  items = FAQS,
  spacing,
  title = 'Frequently asked questions',
  tone = 'sunken',
}: FaqProps) {
```

For homepage runtime, prefer required content props for fields that CMS must own. Optional/default props are acceptable only to preserve shared component call sites such as `ContactSection` outside the homepage or story defaults.

**Form action handoff pattern** (newsletter lines 6-10; contact lines 8-10, 27-30):
```typescript
type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
```

```typescript
type ContactSectionProps = {
  action: (formData: FormData) => Promise<ContactActionResult>
}

export function ContactSection({ action }: ContactSectionProps) {
```

Keep newsletter/contact forms as client leaves; do not move Server Actions into CMS data.

### Hero/Image Rendering Patterns

**Applies to:** `hero.tsx`, `organic-herbs.tsx`, image-card components, certification marks, testimonials, Tea Journal cards.

**Hero LCP image pattern** (`hero.tsx` lines 27-35):
```tsx
<Image
  src={HOMEPAGE_HERO.image.src}
  alt=""
  fill
  sizes="100vw"
  preload
  fetchPriority="high"
  className="absolute inset-0 -z-20 object-cover"
/>
```

Preserve `next/image`, `fill`, `sizes="100vw"`, `preload`, `fetchPriority="high"`, object-cover layout, and no deprecated `priority` prop. Change only the source/alt to normalized CMS image data.

**Overlay image card pattern** (`overlay-image-card.tsx` lines 16-38):
```tsx
<Link
  href={card.href}
  className={cn(
    'group focus-visible:ring-ring relative block aspect-video overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:aspect-square',
    className,
  )}
>
  <Image
    src={card.image.src}
    alt={card.image.alt}
    fill
    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 48vw, 100vw"
    className="object-cover"
  />
  <div
    aria-hidden="true"
    className="from-ink/85 via-ink/15 absolute inset-0 bg-linear-to-t via-65% to-ink/15"
  />
```

**Fixed-dimension logo/mark pattern** (`supply-chain-protection.tsx` lines 74-80):
```tsx
<Image
  src={mark.src}
  alt={mark.alt}
  width={mark.width}
  height={mark.height}
  sizes="(min-width: 1024px) 11vw, (min-width: 640px) 30vw, 45vw"
  className="h-auto max-h-20 w-full object-contain mix-blend-multiply"
/>
```

### Section Layout Patterns

**Split section intro pattern** (`product-range.tsx` lines 8-21):
```tsx
<Section.Root tone="surface">
  <Section.Container>
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Eyebrow className="mb-4">Explore the range</Eyebrow>
        <h2 className="type-heading-01">Explore Our Product Range</h2>
      </div>
      <p className="text-ink-soft max-w-[34ch] lg:text-right">
        We offer wholesale products online direct to consumers and
        businesses, with volume pricing available across eligible bulk
        quantities.
      </p>
    </div>
```

Use this for `ProductRange` and `PrivateLabel`, replacing visible copy with `intro` props while preserving layout.

**Motif band pattern** (`newsletter.tsx` lines 12-25, 28-43):
```tsx
<Section.Root tone="inverse" className="overflow-hidden">
  <Section.Container>
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,160px)]">
      <div className="flex justify-center lg:-ml-18">
        <AnimatedElement
          animation="float-primary"
          src="/images/newsletter-teapot.png"
          width={530}
          height={378}
          className="w-[clamp(200px,25vw,268px)]"
          sizes="(min-width: 1024px) 268px, 40vw"
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow tone="gold" className="mb-4 justify-center">
          Monthly newsletter
        </Eyebrow>
        <h2 className="type-heading-01 text-paper">
          Explore the World of Tea with Monthly Newsletters
        </h2>
        <p className="type-lede text-paper/75 mt-4">
```

Keep motifs code-owned for newsletter, supply-chain, and catalogue CTA. Only intro and CTA copy/hrefs become CMS-driven.

**Client leaf wrapper pattern** (`testimonials.tsx` lines 22-74; `testimonials-slider.tsx` lines 1-23):
```tsx
<TestimonialsSlider slideCount={TESTIMONIALS.length}>
  {TESTIMONIALS.map((testimonial) => (
    <div
      key={testimonial.name}
      className="min-w-0 shrink-0 grow-0 basis-full pl-4"
      role="group"
      aria-roledescription="slide"
      aria-label={`${testimonial.name} testimonial`}
    >
      ...
    </div>
  ))}
</TestimonialsSlider>
```

```typescript
'use client'

type TestimonialsSliderProps = {
  children: ReactNode
  slideCount: number
}

export function TestimonialsSlider({
  children,
  slideCount,
}: TestimonialsSliderProps) {
```

Do not add `'use client'` to the server wrapper. Pass CMS testimonials into the wrapper and keep Embla state isolated in `TestimonialsSlider`.

**Tea Journal wrapper/split pattern** (`tea-journal.tsx` lines 15-27, 44-62):
```typescript
type TeaJournalSectionProps = {
  articles: BlogArticleSummary[]
}

export async function TeaJournal() {
  const articles = await getHomepageArticles(DEFAULT_BLOG_HANDLE)

  if (articles.length === 0) return null

  return <TeaJournalSection articles={articles} />
}

export function TeaJournalSection({ articles }: TeaJournalSectionProps) {
```

```tsx
<Link
  href={getBlogPath(DEFAULT_BLOG_HANDLE)}
  className="focus-visible:ring-ring border-hairline text-ink hover:border-brand hover:text-brand inline-flex items-center gap-2 border-b-[1.5px] pb-0.75 text-[0.92rem] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&_svg]:transition-transform hover:[&_svg]:translate-x-1"
>
  View all
</Link>
```

Update `TeaJournal` to accept CMS blog handle, link label, max posts, and intro. Keep article fetching in `src/lib/blog/operations.ts` and live empty-article behavior (`return null`) intact.

### Storybook Targets (test/story)

**Applies to all modified homepage/contact story files.**

**Basic story args pattern** (`catalogues/cta.stories.tsx` lines 1-26):
```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Cta } from './cta'

const meta: Meta<typeof Cta> = {
  title: 'Homepage/Catalogues',
  component: Cta,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Cta>

export const Default: Story = {
  args: {
    intro: {
      eyebrow: 'Catalogue',
      title: 'Download the wholesale catalogue',
      copy: 'Review organic teas, herbs, spices, and custom blending options for commercial programs.',
    },
    cta: {
      href: '/collections',
      children: 'View catalogue',
    },
  },
}
```

**Action fixture pattern** (`newsletter.stories.tsx` lines 6-24, 33-47):
```typescript
const noopAction = async () => ({ success: true })

const meta: Meta<typeof HomepageNewsletter> = {
  title: 'Homepage/HomepageNewsletter',
  component: HomepageNewsletter,
  tags: ['autodocs'],
  args: {
    action: noopAction,
  },
}

export const Success: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByLabelText('Enter your email'),
      'buyer@example.com',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
  },
}
```

**Data-rich story fixture pattern** (`tea-journal.stories.tsx` lines 14-83, 120-143):
```typescript
const articles = [
  {
    id: 'story-green-tea',
    handle: 'green-tea-sourcing-guide',
    title: 'Green Tea Sourcing Guide',
    excerpt:
      'A practical look at origin, grade, and freshness when buying green tea at wholesale scale.',
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=1200',
      altText: 'Loose leaf green tea',
      width: 1200,
      height: 800,
    },
    publishedAt: '2026-05-01T00:00:00.000Z',
    tags: ['Green Tea'],
    authorName: 'Teavision Team',
    seo: {
      title: null,
      description: null,
      canonicalPath: null,
      noIndex: false,
      ogImage: null,
    },
    readingTimeMinutes: 4,
  },
]

export const Default: Story = {
  args: {
    articles,
  },
}
```

Move static homepage constants into story/test fixture args after prop-enabling. Do not let components import fixture data for route runtime.

## Shared Patterns

### Sanity Server Boundary

**Source:** `src/lib/sanity/client.ts` and `src/lib/sanity/env.ts`
**Apply to:** `src/lib/sanity/home-page.ts`, `src/lib/sanity/queries/home-page.ts`

```typescript
import 'server-only'

export function getSanityClient() {
  const config = getSanityConfig()
  const token = getSanityReadToken()

  return createClient({
    ...config,
    ...(token ? { token } : {}),
    useCdn: false,
    perspective: 'published',
    stega: false,
  })
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return getSanityClient().fetch<T>(query, params)
}
```

### Cache Components

**Source:** `src/lib/blog/operations.ts`, `src/lib/reviews/trustoo.ts`
**Apply to:** Sanity homepage operation and metadata/page fetch.

```typescript
export async function getHomepageArticles(
  blogHandle = DEFAULT_BLOG_HANDLE,
): Promise<BlogArticleSummary[]> {
  'use cache'
  const normalizedHandle = normalizeBlogHandle(blogHandle)
  cacheTag('blog', `blog-${normalizedHandle}`)
  cacheLife('hours')

  const articles = await sanityFetch<SanityBlogPostSummary[]>(
    homepageBlogPostsQuery,
    { blogHandle: normalizedHandle },
  )

  return articles.map((a) => reshapeArticleSummary(a))
}
```

### Metadata And Noindex

**Source:** `src/lib/seo/noindex.ts`, route metadata helpers
**Apply to:** `src/app/(storefront)/page.tsx`

```typescript
export function withNoindexRobots(metadata: Metadata): Metadata {
  if (!isNoindexModeEnabled()) {
    return metadata
  }

  return {
    ...metadata,
    robots: mergeNoindexRobots(metadata.robots),
  }
}
```

CMS `seo.noIndex` should set page-level `robots`, then the final `Metadata` object must pass through `withNoindexRobots()` so launch noindex controls still win.

### Link Validation

**Source:** `../teavision-cms/schemaTypes/objects/homepage/link.ts`
**Apply to:** homepage data-boundary validation.

```typescript
export function isSafeHomeHref(value: unknown): true | string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Link URL is required.";
  }

  const trimmed = value.trim();
  const allowed =
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:");

  return allowed ? true : "Use /, https://, mailto:, or tel: URLs.";
}
```

Mirror this allowlist in storefront validation. Reject invalid links; do not rewrite them.

### CMS Section Shape

**Source:** `../teavision-cms/schemaTypes/documents/home-page.ts`, `../teavision-cms/schemaTypes/objects/homepage/section.ts`
**Apply to:** query projection, raw Sanity types, homepage view model.

```typescript
fields: [
  defineField({
    name: "hero",
    title: "Hero",
    type: "homeHero",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "productRange",
    title: "Product range",
    type: "object",
    fields: [
      defineField({
        name: "intro",
        title: "Intro",
        type: "homeSection",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "cards",
        title: "Cards",
        type: "array",
        of: [defineArrayMember({ type: "homeImageCard" })],
        validation: (Rule) => Rule.required().min(11).max(11),
      }),
    ],
  }),
]
```

```typescript
export const homeSection = defineType({
  name: "homeSection",
  title: "Section intro",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(360),
    }),
  ],
})
```

### Styling And Class Composition

**Source:** `docs/conventions.md`, `src/components/ui/section/section.tsx`, `src/lib/utils.ts`
**Apply to:** all component modifications.

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```tsx
<section
  className={cn(sectionVariants({ spacing, tone, className }))}
  {...props}
>
  {children}
</section>
```

Do not use className concatenation, CSS modules, inline styles, raw hex/rgb values, cool grays, or parent-level `'use client'`.

## No Analog Found

All target files have at least a role-match analog. The only missing exact behavior is **strict fail-loud homepage singleton validation**: existing Sanity blog operations normalize permissively and return `null`/fallback labels in several places. Planner should still use `src/lib/blog/operations.ts` for fetch/cache/reshape structure, but must add explicit homepage validation errors per Phase 22 decisions D-01 through D-04 and D-16.

## Metadata

**Analog search scope:** `src/app/(storefront)`, `src/app/api`, `src/components/homepage`, `src/components/contact`, `src/components/ui`, `src/lib/sanity`, `src/lib/blog`, `src/lib/seo`, `../teavision-cms/schemaTypes`
**Files scanned:** `rg --files src`, `rg --files docs .planning`, all homepage component/story files, Sanity client/query/type files, blog operations/tests, route metadata/page tests, UI primitives, and selected CMS schema files.
**Pattern extraction date:** 2026-07-02
