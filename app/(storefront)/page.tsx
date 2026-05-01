import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'

import { ProductCard } from '@/components/ui'
import { getProducts } from '@/lib/shopify/operations/product'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
  description:
    "Australia's leading bulk tea, herb, and spice supplier. 1,000+ ingredients, 500+ certified organic. Serving cafes, restaurants, and retailers since 2014.",
  openGraph: {
    title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
    description:
      "Australia's leading bulk tea, herb, and spice supplier. 1,000+ ingredients, 500+ certified organic.",
    url: '/',
  },
  alternates: { canonical: '/' },
}

async function FeaturedProducts() {
  const products = await getProducts(4)
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i === 0} />
        </li>
      ))}
    </ul>
  )
}

const CATEGORIES = [
  { name: 'Tea', href: '/collections/tea' },
  { name: 'Tea Bags', href: '/collections/tea-bags' },
  { name: 'Herbs & Spices', href: '/collections/herbs-spices' },
  { name: 'Superfood Powders', href: '/collections/superfood-powders' },
]

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teavision',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1300-729-617',
    contactType: 'sales',
    areaServed: 'AU',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Teavision',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    <div>
      {/* Hero */}
      <section className="bg-surface px-4 py-28 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Australia&rsquo;s #1 tea company
          </h1>
          <p className="text-text-muted mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
            Discover a world of tea mastery in every cup. Handpicked from the
            finest leaves, our loose leaf teas, bulk tea bags, and organic herbs
            deliver rich flavour and freshness. Trusted by Australia&rsquo;s
            leading cafes, retailers, and wellness brands.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/pages/wholesale"
              className="bg-primary text-background hover:bg-primary-hover rounded px-8 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Apply for a Wholesale Account
            </Link>
            <Link
              href="/collections/all"
              className="border-primary text-primary hover:bg-surface rounded border px-8 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Explore Our Teas
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="border-border border-y px-4 py-5">
        <dl className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-2">
            <dt className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-widest">Certified</dt>
            <dd className="text-sm font-medium">HACCP &amp; ACO Organic</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-widest">Range</dt>
            <dd className="text-sm font-medium">1,000+ ingredients, 500+ certified organic</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-widest">Trusted by</dt>
            <dd className="text-sm font-medium">St. Ali, Remedy Drinks, MOOD Tea</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-widest">Awards</dt>
            <dd className="text-sm font-medium">15+ industry awards since 2014</dd>
          </div>
        </dl>
      </section>

      {/* Shop by category */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-semibold">Shop by Category</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" role="list">
            {CATEGORIES.map(({ name, href }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="border-border hover:border-primary hover:bg-surface block rounded border px-4 py-8 text-center font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-surface px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-semibold">Featured Products</h2>
          <Suspense
            fallback={
              <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className="bg-border aspect-3/4 animate-pulse rounded"
                  />
                ))}
              </ul>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </div>
    </>
  )
}
