export type RouteParams = {
  handle: string
  category?: string
}

export type SearchParams = {
  cursor?: string | string[]
  sort?: string | string[]
  filter?: string | string[]
}

export type PageProps = {
  params: Promise<RouteParams>
  searchParams: Promise<SearchParams>
}
