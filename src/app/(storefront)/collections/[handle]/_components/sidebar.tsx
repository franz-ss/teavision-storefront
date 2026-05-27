import Link from 'next/link'

import { FilterPanel } from '@/components/collection'
import { Button, Card } from '@/components/ui'
import type {
  CollectionProductFilter,
  CollectionSummary,
} from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

import { getPath } from '../_lib/page-helpers'

type SidebarProps = {
  activeSelectedFilters: string[]
  clearFiltersHref: string
  handle: string
  productsLength: number
  sidebarCollections: CollectionSummary[]
  visibleFilters: CollectionProductFilter[]
}

export function Sidebar({
  activeSelectedFilters,
  clearFiltersHref,
  handle,
  productsLength,
  sidebarCollections,
  visibleFilters,
}: SidebarProps) {
  return (
    <aside className="hidden lg:grid lg:gap-5">
      <Card padding="md" radius="md">
        <h2 className="type-heading-04 text-strong">Need help choosing?</h2>
        <p className="type-body-sm text-muted mt-3">
          Share your format, volume, and flavour brief with the Teavision team
          before you sample or scale.
        </p>
        <div className="mt-5 grid gap-2">
          <Button href="/pages/contact" variant="primary" size="sm">
            Contact the team
          </Button>
          <Button
            href="/pages/wholesale-account-request"
            variant="secondary"
            size="sm"
          >
            Wholesale access
          </Button>
        </div>
      </Card>

      <Card padding="md" radius="md">
        <FilterPanel
          filters={visibleFilters}
          selectedFilters={activeSelectedFilters}
          resultCount={productsLength}
          clearHref={clearFiltersHref}
        />
      </Card>

      {sidebarCollections.length > 0 && (
        <Card padding="md" radius="md">
          <details open>
            <summary className="type-label text-strong focus-visible:ring-ring flex min-h-11 cursor-pointer list-none items-center rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
              You Might Like
            </summary>
            <nav
              aria-label="You might like collections"
              className="mt-3 max-h-96 overflow-y-auto pr-1"
            >
              <ul className="grid gap-1" role="list">
                {sidebarCollections.map((sidebarCollection) => {
                  const isActive = sidebarCollection.handle === handle

                  return (
                    <li key={sidebarCollection.id}>
                      <Link
                        href={getPath(sidebarCollection.handle)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'type-body-sm focus-visible:ring-ring flex min-h-9 items-center rounded px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                          isActive
                            ? 'bg-surface-sunken text-strong'
                            : 'text-link hover:bg-surface-sunken',
                        )}
                      >
                        {sidebarCollection.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </details>
        </Card>
      )}
    </aside>
  )
}
