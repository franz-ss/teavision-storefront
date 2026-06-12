import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  buildPageHref: (page: number) => string
  'aria-label'?: string
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

export function createVisiblePages(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: 'page' as const,
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
    'type-label border-hairline flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    isCurrent
      ? 'bg-brand text-paper border-brand'
      : 'bg-card text-ink hover:bg-brand-tint hover:text-brand',
  )
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  buildPageHref,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const visiblePages = createVisiblePages(currentPage, totalPages)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {hasPreviousPage && (
        <Link
          href={buildPageHref(currentPage - 1)}
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
            className="type-label text-ink-faint flex min-h-11 min-w-11 items-center justify-center px-3"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Link
            key={item.page}
            href={buildPageHref(item.page)}
            aria-current={item.page === currentPage ? 'page' : undefined}
            className={pageLinkClassName(item.page === currentPage)}
            aria-label={`Page ${item.page}`}
          >
            {item.page}
          </Link>
        ),
      )}

      {hasNextPage && (
        <Link
          href={buildPageHref(currentPage + 1)}
          className={pageLinkClassName(false)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
