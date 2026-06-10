import { Leaf } from 'lucide-react'

import { ProductCard } from '@/components/collection'
import { Button } from '@/components/ui'
import type { CollectionProductSummary } from '@/lib/shopify/types'

type ProductListProps = {
  nextPageHref?: string | null
  products: CollectionProductSummary[]
}

export function ProductList({
  nextPageHref = null,
  products,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <Leaf className="text-ink-faint/50 h-11 w-11" aria-hidden="true" />
        <h3 className="font-display text-ink mt-4 text-2xl">No matches</h3>
        <p className="text-ink-soft mt-2 max-w-sm">
          Try removing a filter, or reach out — we source to order.
        </p>
        <Button
          href="/pages/contact"
          variant="ghost"
          size="sm"
          className="mt-5"
        >
          Clear filters
        </Button>
      </div>
    )
  }

  return (
    <div>
      <ul
        className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4.5 sm:gap-y-5.5 lg:grid-cols-3"
        role="list"
      >
        {products.map((product, index) => (
          <li key={product.id} className="border-hairline-2">
            <ProductCard product={product} priority={index === 0} />
          </li>
        ))}
      </ul>

      {nextPageHref && (
        <div className="mt-10 flex justify-center">
          <Button href={nextPageHref} variant="secondary">
            Next products
          </Button>
        </div>
      )}
    </div>
  )
}
