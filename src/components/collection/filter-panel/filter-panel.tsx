'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { CollectionProductFilter } from '@/lib/shopify/types'
import { Button, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'

type FilterPanelProps = {
  filters: CollectionProductFilter[]
  selectedFilters: string[]
  resultCount: number
  clearHref?: string
  className?: string
}

function formatCount(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`
}

function toSafeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-')
}

export function FilterPanel({
  filters,
  selectedFilters,
  resultCount,
  clearHref,
  className,
}: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedFilterSet = new Set(selectedFilters)
  const visibleFilters = filters.filter((filter) => filter.values.length > 0)

  function replaceFilters(nextFilters: string[]) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('filter')
    nextFilters.forEach((filter) => params.append('filter', filter))
    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  function toggleFilter(input: string, checked: boolean) {
    if (checked) {
      replaceFilters(selectedFilters.filter((filter) => filter !== input))
      return
    }

    replaceFilters([...selectedFilters, input])
  }

  function clearFilters() {
    replaceFilters([])
  }

  return (
    <div className={cn('grid gap-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="type-heading-04 text-strong">Filters</h2>
          <p className="type-body-sm text-muted mt-1">
            {formatCount(resultCount)} shown
          </p>
        </div>
        {selectedFilters.length > 0 &&
          (clearHref ? (
            <Button href={clearHref} variant="ghost" size="sm">
              Clear
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          ))}
      </div>

      {visibleFilters.length === 0 ? (
        <p className="type-body-sm text-muted">
          No filters are available for this collection.
        </p>
      ) : (
        <div className="grid gap-3">
          {visibleFilters.map((filter) => (
            <details
              key={filter.id}
              className="border-default rounded-md border"
              open
            >
              <summary className="type-label text-strong focus-visible:ring-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                {filter.label}
              </summary>
              <div className="border-default grid gap-2 border-t p-3">
                {filter.values.map((value) => {
                  const checked = selectedFilterSet.has(value.input)
                  const disabled = value.count === 0 && !checked
                  const inputId = `filter-${toSafeId(filter.id)}-${toSafeId(
                    value.id,
                  )}`

                  return (
                    <div key={value.id}>
                      {value.href ? (
                        <Link
                          href={value.href}
                          aria-current={checked ? 'page' : undefined}
                          className={cn(
                            'flex min-h-10 items-center gap-3 rounded px-1 transition-colors',
                            checked
                              ? 'bg-surface-sunken text-strong'
                              : 'hover:bg-surface-sunken text-default',
                          )}
                        >
                          <span className="type-body-sm flex-1">
                            {value.label}
                          </span>
                          <span className="type-caption text-muted tabular-nums">
                            {value.count}
                          </span>
                        </Link>
                      ) : (
                        <label
                          htmlFor={inputId}
                          className={cn(
                            'flex min-h-10 cursor-pointer items-center gap-3 rounded px-1',
                            disabled && 'cursor-not-allowed opacity-50',
                          )}
                        >
                          <Checkbox
                            id={inputId}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleFilter(value.input, checked)}
                          />
                          <span className="type-body-sm text-default flex-1">
                            {value.label}
                          </span>
                          <span className="type-caption text-muted tabular-nums">
                            {value.count}
                          </span>
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
