import Form from 'next/form'
import { Search } from 'lucide-react'

import { Button, TextInput } from '@/components/ui'

export function SearchPageSearchForm({ query = '' }: { query?: string }) {
  return (
    <Form
      action="/search"
      className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
    >
      <label htmlFor="search-page-query" className="sr-only">
        Search query
      </label>
      <TextInput
        id="search-page-query"
        name="q"
        type="search"
        defaultValue={query}
        autoComplete="off"
        placeholder="Find products…"
        enterKeyHint="search"
      />
      <Button type="submit" size="lg">
        <Search className="size-4" aria-hidden="true" />
        Search
      </Button>
    </Form>
  )
}
