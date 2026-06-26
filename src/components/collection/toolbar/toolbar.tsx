import { Suspense } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import type { CollectionProductFilter } from '@/lib/shopify/types'
import { getSelectedCollectionFilterLabels } from '@/lib/shopify/filters'

import { FilterPanel } from '../filter-panel'
import { SortSelect } from '../sort-select'

type ToolbarProps = {
  currentSort: string
  productCount: number
  filters: CollectionProductFilter[]
  selectedFilters: string[]
  clearHref?: string
  className?: string
}

export function Toolbar({
  currentSort,
  productCount,
  filters,
  selectedFilters,
  clearHref,
  className,
}: ToolbarProps) {
  const selectedFilterLabels = getSelectedCollectionFilterLabels(
    filters,
    selectedFilters,
  )

  return (
    <div className={className}>
      {/* Top bar: count + sort */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="type-mono-meta text-ink-faint">
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </span>
        <Suspense fallback={null}>
          <SortSelect currentSort={currentSort} />
        </Suspense>
      </div>

      {/* Active filter chips */}
      {selectedFilterLabels.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedFilterLabels.map((filter) => (
            <span
              key={filter.input}
              className="bg-brand-tint text-brand inline-flex items-center gap-1.5 rounded-full px-3 py-1.75 text-xs font-semibold"
            >
              {filter.label}
              <X className="size-3" aria-hidden="true" />
            </span>
          ))}
        </div>
      )}

      {/* Mobile filter toggle */}
      <details className="bg-paper border-hairline mt-2 rounded-lg border lg:hidden">
        <summary className="type-label text-ink focus-visible:ring-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filter products
          </span>
          {selectedFilters.length > 0 && (
            <span className="type-mono-meta text-ink-faint">
              {selectedFilters.length} active
            </span>
          )}
        </summary>
        <div className="p-4">
          <Suspense fallback={null}>
            <FilterPanel
              filters={filters}
              selectedFilters={selectedFilters}
              resultCount={productCount}
              clearHref={clearHref}
            />
          </Suspense>
        </div>
      </details>
    </div>
  )
}
