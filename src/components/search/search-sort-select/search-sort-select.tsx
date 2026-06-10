'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ChangeEvent, useCallback } from 'react'

import {
  SEARCH_SORT_OPTIONS,
  type SearchSortValue,
} from '@/lib/searchanise/types'

type SearchSortSelectProps = {
  currentSort: SearchSortValue
}

export function SearchSortSelect({ currentSort }: SearchSortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createSortUrl = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.delete('page')

      if (sort === 'relevance') {
        params.delete('sort')
      } else {
        params.set('sort', sort)
      }

      const queryString = params.toString()

      return queryString ? `${pathname}?${queryString}` : pathname
    },
    [pathname, searchParams],
  )

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    router.replace(createSortUrl(event.target.value), { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="search-sort-select"
        className="type-mono-meta text-ink-faint shrink-0 whitespace-nowrap"
      >
        Sort
      </label>
      <select
        id="search-sort-select"
        value={currentSort}
        onChange={handleChange}
        className="border-hairline bg-card type-label text-ink focus-visible:ring-ring min-w-48 cursor-pointer appearance-none rounded-full border px-4 py-2.25 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {SEARCH_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
