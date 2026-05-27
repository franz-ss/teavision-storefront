'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ChangeEvent, useCallback } from 'react'

import { Select } from '@/components/ui'
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
    <div className="flex items-center gap-3">
      <label
        htmlFor="search-sort-select"
        className="type-label text-strong shrink-0 whitespace-nowrap"
      >
        Sort by
      </label>
      <Select
        id="search-sort-select"
        value={currentSort}
        onChange={handleChange}
        className="min-w-48"
      >
        {SEARCH_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
