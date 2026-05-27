import { ProductCard } from '@/components/collection'
import type { SearchaniseSearchResult } from '@/lib/searchanise/types'

import { SearchAlert } from './search-alert'

export function ProductResults({
  result,
}: {
  result: SearchaniseSearchResult
}) {
  if (result.products.length === 0) {
    return (
      <SearchAlert
        tone="empty"
        message="No products matched this search. Try removing a filter or searching a broader term."
      />
    )
  }

  return (
    <ul className="grid gap-4" role="list">
      {result.products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index === 0} />
        </li>
      ))}
    </ul>
  )
}
