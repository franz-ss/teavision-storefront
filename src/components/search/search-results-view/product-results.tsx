import { ProductCard } from '@/components/collection'
import type { SearchaniseSearchResult } from '@/lib/searchanise/types'

import { SearchAlert } from './search-alert'

const FIRST_VISIBLE_PRODUCT_ROW_COUNT = 3

export function ProductResults({
  clearHref,
  result,
}: {
  clearHref: string
  result: SearchaniseSearchResult
}) {
  if (result.products.length === 0) {
    return (
      <SearchAlert
        actionHref={clearHref}
        actionLabel="Clear filters"
        tone="empty"
        message="No products matched this search. Try removing a filter or searching a broader term."
      />
    )
  }

  return (
    <ul
      className="grid grid-cols-2 gap-x-4.5 gap-y-5.5 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
    >
      {result.products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < FIRST_VISIBLE_PRODUCT_ROW_COUNT}
          />
        </li>
      ))}
    </ul>
  )
}
