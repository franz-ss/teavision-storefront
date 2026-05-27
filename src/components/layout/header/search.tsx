'use client'

import { useSearchParams } from 'next/navigation'

import { SearchAutocomplete } from './search-autocomplete'

export function Search() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''

  return <SearchAutocomplete key={urlQuery} initialQuery={urlQuery} />
}
