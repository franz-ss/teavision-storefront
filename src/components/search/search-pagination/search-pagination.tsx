import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type {
  SearchRouteState,
  SearchanisePagination as SearchanisePaginationData,
} from '@/lib/searchanise/types'
import { createPageHref } from '@/lib/searchanise/params'
import { cn } from '@/lib/utils'

type SearchPaginationProps = {
  pagination: SearchanisePaginationData
  state: SearchRouteState
  className?: string
}

type PageItem =
  | {
      type: 'page'
      page: number
    }
  | {
      type: 'ellipsis'
      id: string
    }

function createVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: 'page',
      page: index + 1,
    }))
  }

  const pages = new Set([1, totalPages, currentPage])

  if (currentPage > 2) pages.add(currentPage - 1)
  if (currentPage < totalPages - 1) pages.add(currentPage + 1)

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const items: PageItem[] = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push({ type: 'ellipsis', id: `${previousPage}-${page}` })
    }

    items.push({ type: 'page', page })
  })

  return items
}

function pageLinkClassName(isCurrent: boolean): string {
  return cn(
    'type-label border-default flex size-10 items-center justify-center rounded-md border transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    isCurrent
      ? 'bg-strong text-on-brand'
      : 'bg-surface text-default hover:bg-surface-sunken',
  )
}

export function SearchPagination({
  className,
  pagination,
  state,
}: SearchPaginationProps) {
  if (pagination.totalPages <= 1) return null

  const visiblePages = createVisiblePages(
    pagination.currentPage,
    pagination.totalPages,
  )

  return (
    <nav
      aria-label="Search result pages"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {pagination.hasPreviousPage && (
        <Link
          href={createPageHref(state, pagination.currentPage - 1)}
          className={pageLinkClassName(false)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      )}

      {visiblePages.map((item) =>
        item.type === 'ellipsis' ? (
          <span
            key={item.id}
            className="type-label text-muted flex size-10 items-center justify-center"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Link
            key={item.page}
            href={createPageHref(state, item.page)}
            aria-current={
              item.page === pagination.currentPage ? 'page' : undefined
            }
            className={pageLinkClassName(item.page === pagination.currentPage)}
            aria-label={`Page ${item.page}`}
          >
            {item.page}
          </Link>
        ),
      )}

      {pagination.hasNextPage && (
        <Link
          href={createPageHref(state, pagination.currentPage + 1)}
          className={pageLinkClassName(false)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
