import Link from 'next/link'

import { cn } from '@/lib/utils'

import { getPaginationHref, getPaginationItems } from './helpers'

type PaginationProps = {
  activeTag: string | null
  blogHandle: string
  currentPage: number
  query?: string | null
  totalPages: number
}

export function Pagination({
  activeTag,
  blogHandle,
  currentPage,
  query,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Blog pagination"
      className="border-hairline mt-12 flex items-center justify-center gap-1 border-t pt-8"
    >
      {getPaginationItems(currentPage, totalPages).map((item) =>
        typeof item === 'number' ? (
          <Link
            key={item}
            href={getPaginationHref({
              activeTag,
              blogHandle,
              page: item,
              query,
            })}
            aria-current={item === currentPage ? 'page' : undefined}
            className={cn(
              'type-label focus-visible:ring-ring flex min-h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              item === currentPage
                ? 'bg-brand text-paper'
                : 'border-hairline bg-card text-ink hover:bg-brand-tint hover:text-brand border',
            )}
          >
            {item}
          </Link>
        ) : (
          <span
            key={item}
            className="type-label text-ink-faint flex min-h-11 w-11 items-center justify-center"
            aria-hidden="true"
          >
            …
          </span>
        ),
      )}
    </nav>
  )
}
