'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, type ChangeEvent } from 'react'

import { Select } from '@/components/ui'

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
    <div className="ml-auto flex w-min items-center gap-3">
      <label
        htmlFor="sort-select"
        className="type-label text-strong shrink-0 whitespace-nowrap"
      >
        Sort by
      </label>
      <Select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="min-w-48"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
