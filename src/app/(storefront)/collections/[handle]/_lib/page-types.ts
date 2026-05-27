export type RouteParams = {
  handle: string
  category?: string
}

export type SearchParams = {
  sort?: string | string[]
  filter?: string | string[]
}

export type PageProps = {
  params: Promise<RouteParams>
  searchParams: Promise<SearchParams>
}
