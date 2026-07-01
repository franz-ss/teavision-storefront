'use client'

import { useSearchParams } from 'next/navigation'

import { SearchAutocomplete } from './autocomplete'

export function Search({ onNavigate }: { onNavigate?: () => void }) {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''

  return (
    <SearchAutocomplete
      key={urlQuery}
      initialQuery={urlQuery}
      onNavigate={onNavigate}
    />
  )
}
