import { Leaf } from 'lucide-react'

import { ProductCard } from '@/components/collection'
import { Button, Pagination } from '@/components/ui'
import type { CollectionProductSummary } from '@/lib/shopify/types'

type ProductListProps = {
  clearFiltersHref?: string | null
  currentPage?: number
  totalPages?: number
  buildPageHref?: (page: number) => string
  products: CollectionProductSummary[]
}

const FIRST_VISIBLE_PRODUCT_ROW_COUNT = 3

export function ProductList({
  clearFiltersHref = null,
  currentPage = 1,
  totalPages = 1,
  buildPageHref,
  products,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <Leaf className="text-ink-faint/50 size-11" aria-hidden="true" />
        <h3 className="font-display text-ink mt-4 text-2xl">No matches</h3>
        <p className="text-ink-soft mt-2 max-w-sm">
          Try removing a filter, or reach out — we source to order.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {clearFiltersHref ? (
            <Button href={clearFiltersHref} variant="ghost" size="sm">
              Clear filters
            </Button>
          ) : null}
          <Button href="/pages/contact" variant="ghost" size="sm">
            Contact us
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ul
        id="product-grid"
        className="grid scroll-mt-24 grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4.5 sm:gap-y-5.5 lg:scroll-mt-32 lg:grid-cols-3"
        role="list"
      >
        {products.map((product, index) => (
          <li key={product.id} className="border-hairline-2">
            <ProductCard
              product={product}
              priority={index < FIRST_VISIBLE_PRODUCT_ROW_COUNT}
            />
          </li>
        ))}
      </ul>

      {buildPageHref && totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildPageHref={(page) => `${buildPageHref(page)}#product-grid`}
            aria-label="Collection pagination"
          />
        </div>
      )}
    </div>
  )
}
