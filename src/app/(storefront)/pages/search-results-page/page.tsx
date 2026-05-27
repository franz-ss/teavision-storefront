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

async function SearchResultsPageRedirectContent({
  searchParams,
}: Props) {
  await connection()

  redirect(createLegacySearchRedirectHref(await searchParams))

  return null
}

export default function SearchResultsPageRedirect({ searchParams }: Props) {
  return (
    <Suspense fallback={null}>
      <SearchResultsPageRedirectContent searchParams={searchParams} />
    </Suspense>
  )
}
