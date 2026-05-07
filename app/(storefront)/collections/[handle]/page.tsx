import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { ProductCollectionSortKeys } from '@/lib/shopify/types'
import { SortSelect } from '@/components/collection'
import { ProductCard, Section } from '@/components/ui'
import { cn } from '@/lib/utils'

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string }>
}

const SORT_MAP: Record<
  string,
  { sortKey: ProductCollectionSortKeys; reverse: boolean }
> = {
  featured: {
    sortKey: ProductCollectionSortKeys.CollectionDefault,
    reverse: false,
  },
  'best-selling': {
    sortKey: ProductCollectionSortKeys.BestSelling,
    reverse: false,
  },
  'title-asc': { sortKey: ProductCollectionSortKeys.Title, reverse: false },
  'title-desc': { sortKey: ProductCollectionSortKeys.Title, reverse: true },
  'price-asc': { sortKey: ProductCollectionSortKeys.Price, reverse: false },
  'price-desc': { sortKey: ProductCollectionSortKeys.Price, reverse: true },
  newest: { sortKey: ProductCollectionSortKeys.Created, reverse: true },
}

const COLLECTION_BODY_CLASS_NAME = cn(
  'type-body space-y-6 break-words text-default',
  '[&>*:first-child]:mt-0 [&_*]:!text-inherit [&_a]:!text-link [&_a]:underline [&_a]:underline-offset-4',
  '[&_blockquote]:type-body-lg [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-default [&_blockquote]:bg-surface [&_blockquote]:p-5 [&_blockquote]:italic',
  '[&_h3]:type-heading-03 [&_h3]:mt-10 [&_h3]:!text-strong [&_h4]:type-heading-04 [&_h4]:mt-8 [&_h4]:!text-strong',
  '[&_hr]:border-default [&_img]:my-8 [&_img]:h-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-default',
  '[&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:text-default [&_strong]:type-label [&_table]:w-full [&_table]:border-collapse',
  '[&_td]:border [&_td]:border-default [&_td]:p-3 [&_th]:type-label [&_th]:border [&_th]:border-default [&_th]:bg-surface-sunken [&_th]:p-3 [&_ul]:list-disc [&_ul]:pl-6',
)

const PRIMARY_LINK_CLASS_NAME =
  'type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_LINK_CLASS_NAME =
  'type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SUPPORT_POINTS = [
  {
    term: 'Commercial pack sizes',
    detail: 'Tea, herbs, spices, powders, and bags for repeat supply.',
  },
  {
    term: 'Sample before scaling',
    detail: 'Evaluate aroma, cut, colour, and menu fit before ordering bulk.',
  },
  {
    term: 'Blending and sourcing',
    detail: 'Talk to the team about custom blends, private label, or origin.',
  },
] as const

function truncateMetaDescription(value: string): string {
  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}...` : value
}

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeCollectionHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s(?:style|class|id|data-[^=]+)="[^"]*"/gi, '')
    .replace(/\s(?:style|class|id|data-[^=]+)='[^']*'/gi, '')
    .replace(/<h[12](\s[^>]*)?>/gi, '<h3>')
    .replace(/<\/h[12]>/gi, '</h3>')
}

function shouldRenderRichDescription(
  descriptionHtml: string,
  description: string,
): boolean {
  const text = plainTextFromHtml(descriptionHtml)

  return (
    text.length > description.length + 40 ||
    /<(h[1-6]|ul|ol|table|blockquote)\b/i.test(descriptionHtml)
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
  const description = truncateMetaDescription(
    collection.seo.description ??
      collection.description ??
      `Browse ${collection.title} from Teavision, Australia's bulk tea and herb supplier.`,
  )
  const title = collection.seo.title ?? collection.title

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/collections/${handle}`,
      images: collection.featuredImage
        ? [
            {
              url: collection.featuredImage.url,
              alt: collection.featuredImage.altText ?? collection.title,
            },
          ]
        : undefined,
    },
    alternates: { canonical: `/collections/${handle}` },
  }
}

async function CollectionContent({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const [{ handle }, { sort: sortParam }] = await Promise.all([
    params,
    searchParams,
  ])

  const sort = sortParam && sortParam in SORT_MAP ? sortParam : 'featured'
  const { sortKey, reverse } = SORT_MAP[sort]

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle, 250, sortKey, reverse),
  ])

  if (!collection) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'
  const collectionUrl = `${baseUrl}/collections/${handle}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${baseUrl}/collections/all`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: collection.title,
            item: collectionUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: collection.title,
        description: collection.description,
        url: collectionUrl,
        dateModified: collection.updatedAt,
      },
      {
        '@type': 'ItemList',
        name: `${collection.title} products`,
        itemListElement: products.slice(0, 24).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/products/${product.handle}`,
          item: {
            '@type': 'Product',
            name: product.title,
            image: product.featuredImage?.url,
            offers: {
              '@type': 'Offer',
              price: product.priceRange.minVariantPrice.amount,
              priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            },
          },
        })),
      },
    ],
  }
  const productCountLabel = `${products.length} ${
    products.length === 1 ? 'product' : 'products'
  }`
  const richDescriptionHtml = normalizeCollectionHtml(
    collection.descriptionHtml,
  )
  const hasRichDescription = shouldRenderRichDescription(
    collection.descriptionHtml,
    collection.description,
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Section.Root tone="sunken" className="border-default border-b">
        <Section.Container>
          <nav
            aria-label="Breadcrumb"
            className="type-body-sm text-muted mb-8 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/"
              className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/collections/all"
              className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Collections
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-default">
              {collection.title}
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
            <div className="min-w-0 lg:col-span-2">
              <p className="type-eyebrow text-accent">Wholesale collection</p>
              <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="type-body-lg text-muted mt-6 max-w-prose break-words">
                  {collection.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/pages/wholesale-account-request"
                  className={cn(PRIMARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
                >
                  Request wholesale access
                </Link>
                <Link
                  href="/pages/contact"
                  className={cn(SECONDARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
                >
                  Ask about this range
                </Link>
              </div>
            </div>

            <aside className="border-default min-w-0 border-t pt-6 lg:border-t-0 lg:border-l lg:pl-8">
              {collection.featuredImage &&
                collection.featuredImage.width &&
                collection.featuredImage.height && (
                  <figure className="mb-6">
                    <Image
                      src={`${collection.featuredImage.url}&width=720`}
                      alt={collection.featuredImage.altText ?? collection.title}
                      width={collection.featuredImage.width}
                      height={collection.featuredImage.height}
                      priority
                      sizes="(min-width: 1024px) 22rem, 100vw"
                      className="border-default aspect-[4/3] w-full rounded-lg border object-cover"
                    />
                  </figure>
                )}
              <dl className="grid gap-5">
                <div>
                  <dt className="type-eyebrow text-accent">In range</dt>
                  <dd className="type-heading-03 text-brand mt-1">
                    {productCountLabel}
                  </dd>
                </div>
                {SUPPORT_POINTS.map((point) => (
                  <div
                    key={point.term}
                    className="border-default border-t pt-5"
                  >
                    <dt className="type-label text-strong">{point.term}</dt>
                    <dd className="type-body-sm text-muted mt-2">
                      {point.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Section.Container>
      </Section.Root>

      <main className="bg-canvas">
        <Section.Root
          tone="transparent"
          aria-labelledby="collection-products-heading"
        >
          <Section.Container>
            <div className="border-default mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="type-eyebrow text-accent">Catalogue</p>
                <h2
                  id="collection-products-heading"
                  className="type-heading-02 text-strong mt-3"
                >
                  Products in this range
                </h2>
                <p className="type-body-sm text-muted mt-3">
                  {productCountLabel} available for browsing, sampling, and bulk
                  ordering.
                </p>
              </div>
              <Suspense fallback={null}>
                <SortSelect currentSort={sort} />
              </Suspense>
            </div>

            <ul
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              role="list"
            >
              {products.length === 0 ? (
                <li className="border-default bg-surface col-span-full rounded-lg border px-6 py-16 text-center">
                  <h3 className="type-heading-03 text-strong">
                    No products listed yet
                  </h3>
                  <p className="type-body-sm text-muted mx-auto mt-3 max-w-lg">
                    This collection is available in Shopify, but no products are
                    currently published to it. The Teavision team can still help
                    confirm suitable options.
                  </p>
                  <Link
                    href="/pages/contact"
                    className={cn(PRIMARY_LINK_CLASS_NAME, 'mt-6')}
                  >
                    Contact Teavision
                  </Link>
                </li>
              ) : (
                products.map((product, i) => (
                  <li key={product.id}>
                    <ProductCard product={product} priority={i === 0} />
                  </li>
                ))
              )}
            </ul>
          </Section.Container>
        </Section.Root>

        {hasRichDescription && (
          <Section.Root
            tone="surface"
            aria-labelledby="collection-about-heading"
            className="border-default border-t"
          >
            <Section.Container>
              <p className="type-eyebrow text-accent">Range notes</p>
              <h2
                id="collection-about-heading"
                className="type-heading-02 text-strong mt-3"
              >
                About {collection.title}
              </h2>
              <div
                className={cn(COLLECTION_BODY_CLASS_NAME, 'mt-8 max-w-prose')}
                dangerouslySetInnerHTML={{ __html: richDescriptionHtml }}
              />
            </Section.Container>
          </Section.Root>
        )}
      </main>
    </>
  )
}

export default function CollectionPage({ params, searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <div className="type-body text-muted mx-auto max-w-7xl px-4 py-12 md:px-6">
          Loading collection...
        </div>
      }
    >
      <CollectionContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}
