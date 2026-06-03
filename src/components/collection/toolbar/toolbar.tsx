import { Suspense } from 'react'
import { SlidersHorizontal } from 'lucide-react'

import type { CollectionProductFilter } from '@/lib/shopify/types'

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
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <SortSelect currentSort={currentSort} />
      </Suspense>

      <details className="bg-surface mt-5 rounded-md lg:hidden">
        <summary className="type-label text-strong focus-visible:ring-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filter products
          </span>
          {selectedFilters.length > 0 && (
            <span className="type-caption text-muted">
              {selectedFilters.length} active
            </span>
          )}
        </summary>
        <div className="p-4">
          <FilterPanel
            filters={filters}
            selectedFilters={selectedFilters}
            resultCount={productCount}
            clearHref={clearHref}
          />
        </div>
      </details>
    </div>
  )
}
