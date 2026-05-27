import { redirect } from 'next/navigation'
import { connection } from 'next/server'

import {
  createLegacySearchRedirectHref,
  type SearchParamsInput,
} from '@/lib/searchanise/params'

type Props = {
  searchParams: Promise<SearchParamsInput>
}

export default async function SearchResultsRedirect({ searchParams }: Props) {
  await connection()

  redirect(createLegacySearchRedirectHref(await searchParams))
}
