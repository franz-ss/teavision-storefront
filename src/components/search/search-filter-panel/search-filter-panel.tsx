import Link from 'next/link'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export type SearchFilterPanelFacetValue = {
  id: string
  label: string
  count: number
  selected: boolean
  href: string
}

export type SearchFilterPanelFacet = {
  attribute: string
  label: string
  values: SearchFilterPanelFacetValue[]
}

type SearchFilterPanelProps = {
  clearHref: string
  facets: SearchFilterPanelFacet[]
  resultCount: number
  selectedFilterCount: number
  className?: string
}

function formatResultCount(count: number): string {
  return `${count} ${count === 1 ? 'result' : 'results'}`
}

export function SearchFilterPanel({
  clearHref,
  className,
  facets,
  resultCount,
  selectedFilterCount,
}: SearchFilterPanelProps) {
  const visibleFacets = facets.filter((facet) => facet.values.length > 0)

  return (
    <div className={cn('grid gap-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="type-heading-04 text-strong">Filters</h2>
          <p className="type-body-sm text-muted mt-1">
            {formatResultCount(resultCount)}
          </p>
        </div>
        {selectedFilterCount > 0 && (
          <Button href={clearHref} variant="ghost" size="sm">
            Clear
          </Button>
        )}
      </div>

      {visibleFacets.length === 0 ? (
        <p className="type-body-sm text-muted">
          No filters are available for this search.
        </p>
      ) : (
        <div className="grid gap-3">
          {visibleFacets.map((facet) => (
            <details
              key={facet.attribute}
              className="border-default rounded-md border"
              open
            >
              <summary className="type-label text-strong focus-visible:ring-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                {facet.label}
              </summary>
              <div className="border-default grid gap-1 border-t p-3">
                {facet.values.map((value) => (
                  <Link
                    key={value.id}
                    href={value.href}
                    aria-current={value.selected ? 'page' : undefined}
                    className={cn(
                      'focus-visible:ring-ring flex min-h-10 items-center gap-3 rounded px-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      value.selected
                        ? 'bg-surface-sunken text-strong'
                        : 'text-default hover:bg-surface-sunken',
                    )}
                  >
                    <span
                      className={cn(
                        'border-default flex size-4 shrink-0 items-center justify-center rounded border',
                        value.selected && 'border-brand bg-brand text-on-brand',
                      )}
                      aria-hidden="true"
                    >
                      {value.selected && <Check className="size-3" />}
                    </span>
                    <span className="type-body-sm min-w-0 flex-1">
                      {value.label}
                    </span>
                    <span className="type-caption text-muted tabular-nums">
                      {value.count}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
