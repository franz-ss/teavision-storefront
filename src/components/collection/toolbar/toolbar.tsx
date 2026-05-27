import { Suspense } from 'react'
import { SlidersHorizontal } from 'lucide-react'

import type { CollectionProductFilter } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

import { FilterPanel } from '../filter-panel'
import { SortSelect } from '../sort-select'

type ToolbarProps = {
  headingId: string
  currentSort: string
  productCount: number
  filters: CollectionProductFilter[]
  selectedFilters: string[]
  clearHref?: string
  className?: string
}

function getProductCountLabel(productCount: number): string {
  return `${productCount} ${productCount === 1 ? 'product' : 'products'}`
}

export function Toolbar({
  headingId,
  currentSort,
  productCount,
  filters,
  selectedFilters,
  clearHref,
  className,
}: ToolbarProps) {
  const productCountLabel = getProductCountLabel(productCount)

  return (
    <div className={cn('border-default border-b pb-6', className)}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-eyebrow text-accent">Catalogue</p>
          <h2
            id={headingId}
            className="type-heading-03 md:type-heading-02 text-strong mt-3 wrap-break-word"
          >
            Products in this range
          </h2>
          <p className="type-body-sm text-muted mt-3">
            {productCountLabel} available for browsing, sampling, and bulk
            ordering.
          </p>
        </div>
        <Suspense fallback={null}>
          <SortSelect currentSort={currentSort} />
        </Suspense>
      </div>

      <details className="border-default bg-surface mt-5 rounded-md border lg:hidden">
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
        <div className="border-default border-t p-4">
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
