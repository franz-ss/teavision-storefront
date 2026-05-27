export type SearchParams = {
  page?: string
  q?: string
}

export type ListingProps = {
  params: Promise<{ blog: string; tag?: string }>
  searchParams: Promise<SearchParams>
}
