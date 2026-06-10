import Link from 'next/link'
import { Check } from 'lucide-react'

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
    <div className={cn('grid gap-0', className)}>
      <div className="flex items-start justify-between gap-4 pb-4">
        <div>
          <h2 className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint">
            Filters
          </h2>
          <p className="type-body-sm text-ink-soft mt-1">
            {formatResultCount(resultCount)}
          </p>
        </div>
        {selectedFilterCount > 0 && (
          <Link
            href={clearHref}
            className="type-mono-meta text-gold-deep hover:text-brand focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Clear
          </Link>
        )}
      </div>

      {visibleFacets.length === 0 ? (
        <p className="type-body-sm text-ink-soft">
          No filters are available for this search.
        </p>
      ) : (
        <div>
          {visibleFacets.map((facet) => (
            <details
              key={facet.attribute}
              className="border-b border-hairline py-5.5"
              open
            >
              <summary className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint focus-visible:ring-ring flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                {facet.label}
              </summary>
              <div className="mt-3 grid gap-1.5">
                {facet.values.map((value) => (
                  <Link
                    key={value.id}
                    href={value.href}
                    aria-current={value.selected ? 'page' : undefined}
                    className={cn(
                      'focus-visible:ring-ring flex min-h-10 items-center gap-3 rounded px-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      value.selected
                        ? 'bg-paper-2 text-ink'
                        : 'text-ink-soft hover:bg-paper-2',
                    )}
                  >
                    <span
                      className={cn(
                        'border-hairline flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px]',
                        value.selected && 'border-brand bg-brand text-paper',
                      )}
                      aria-hidden="true"
                    >
                      {value.selected && <Check className="size-3" />}
                    </span>
                    <span className="type-body-sm min-w-0 flex-1">
                      {value.label}
                    </span>
                    <span className="font-mono text-ink-faint tabular-nums text-[11px]">
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
