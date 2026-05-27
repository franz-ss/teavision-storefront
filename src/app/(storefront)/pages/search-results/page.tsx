import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

import {
  createLegacySearchRedirectHref,
  type SearchParamsInput,
} from '@/lib/searchanise/params'

type Props = {
  searchParams: Promise<SearchParamsInput>
}

async function SearchResultsRedirectContent({ searchParams }: Props) {
  await connection()

  redirect(createLegacySearchRedirectHref(await searchParams))

  return null
}

export default function SearchResultsRedirect({ searchParams }: Props) {
  return (
    <Suspense fallback={null}>
      <SearchResultsRedirectContent searchParams={searchParams} />
    </Suspense>
  )
}
