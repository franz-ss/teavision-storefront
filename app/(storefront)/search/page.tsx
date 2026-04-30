import type { Metadata } from 'next'

import { searchProducts } from '@/lib/shopify/operations/search'
import { ProductCard } from '@/components/ui'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  const title = q ? `Search: "${q}"` : 'Search'
  return {
    title,
    description: q
      ? `Search results for "${q}" on Teavision — Australia's bulk tea and herb supplier.`
      : 'Search Teavision for bulk tea, herbs, and spices.',
    robots: { index: false },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams

  const products = q ? await searchProducts(q) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {q ? `Search results for "${q}"` : 'Search'}
      </h1>

      {!q && (
        <p className="text-text-muted">Enter a search term to find products.</p>
      )}

      {q && products.length === 0 && (
        <p className="text-text-muted">No products found for &ldquo;{q}&rdquo;.</p>
      )}

      {products.length > 0 && (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i === 0} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
