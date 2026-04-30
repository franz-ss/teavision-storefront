import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/ui/product-card'
import { getProducts } from '@/lib/shopify/operations/product'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
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

const TRUST_STATS = [
  {
    value: '100%',
    label: 'Australian Owned & Operated',
    icon: (
      <svg
        className="text-primary h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.038 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.038-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
  {
    value: '#1',
    label: 'Tea & Herb Wholesale Supplier',
    icon: (
      <svg
        className="text-primary h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
        />
      </svg>
    ),
  },
  {
    value: '1,000+',
    label: 'Ingredients incl. 500+ Certified Organic',
    icon: (
      <svg
        className="text-primary h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
  {
    value: '15+',
    label: 'Industry Awards',
    icon: (
      <svg
        className="text-primary h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
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
              className="bg-primary text-background hover:bg-primary-hover rounded px-8 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Apply for a Wholesale Account
            </Link>
            <Link
              href="/collections/all"
              className="border-primary text-primary hover:bg-surface rounded border px-8 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Explore Our Teas
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-border bg-background border-y px-4 py-8">
        <ul
          className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4"
          role="list"
        >
          {TRUST_STATS.map(({ value, label, icon }) => (
            <li key={value} className="flex items-center gap-3">
              {icon}
              <div>
                <p className="text-lg leading-tight font-bold">{value}</p>
                <p className="text-text-muted text-xs leading-snug">{label}</p>
              </div>
            </li>
          ))}
        </ul>
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
                    className="bg-border animate-pulse rounded"
                    style={{ aspectRatio: '3/4' }}
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
  )
}
