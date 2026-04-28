import Link from 'next/link'
import type { Metadata } from 'next'
import type { ProductSummary } from '@/lib/shopify/types'
import { ProductCard } from '@/components/ui/product-card'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
}

const STUB_PRODUCTS: ProductSummary[] = [
  {
    id: '1',
    handle: 'product-placeholder-1',
    title: 'English Breakfast Loose Leaf',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'AUD' } },
  },
  {
    id: '2',
    handle: 'product-placeholder-2',
    title: 'Chamomile Flowers Whole',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '24.00', currencyCode: 'AUD' } },
  },
  {
    id: '3',
    handle: 'product-placeholder-3',
    title: 'Matcha Ceremonial Grade',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '48.00', currencyCode: 'AUD' } },
  },
  {
    id: '4',
    handle: 'product-placeholder-4',
    title: 'Earl Grey Loose Leaf',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '22.00', currencyCode: 'AUD' } },
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-surface px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Australia&rsquo;s #1 Tea Supplier
        </h1>
        <p className="text-text-muted mt-4 text-lg">
          Bulk wholesale tea, herbs, and spices for cafes, restaurants, and
          retailers.
        </p>
        <Link
          href="/collections/all"
          className="bg-primary text-background hover:bg-primary-hover mt-8 inline-block rounded px-6 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Shop All Products
        </Link>
      </section>

      {/* Featured collections placeholder */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Shop by Category</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" role="list">
            {['Black Tea', 'Green Tea', 'Herbs & Spices', 'Custom Blends'].map(
              (name) => (
                <li key={name}>
                  <Link
                    href="#"
                    className="border-border hover:border-primary block rounded border p-6 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {name}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-surface px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
            {STUB_PRODUCTS.map((product, i) => (
              <li key={product.id}>
                <ProductCard product={product} priority={i === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
