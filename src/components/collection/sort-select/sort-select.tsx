'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, type ChangeEvent } from 'react'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'title-asc', label: 'Name: A-Z' },
  { value: 'title-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low-High' },
  { value: 'price-desc', label: 'Price: High-Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createSortUrl = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (sort === 'featured') {
        params.delete('sort')
      } else {
        params.set('sort', sort)
      }
      const qs = params.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, searchParams],
  )

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    router.replace(createSortUrl(e.target.value), { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="type-mono-meta text-ink-faint shrink-0 whitespace-nowrap"
      >
        Sort
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="border-hairline bg-card type-label text-ink focus-visible:ring-ring min-w-36 cursor-pointer appearance-none rounded-full border px-4 py-2.25 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
