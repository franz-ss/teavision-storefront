'use client'

import { useRouter } from 'next/navigation'
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SubmitEvent,
} from 'react'

import type { ProductSummary } from '@/lib/shopify/types'

import { SearchForm } from './search-form'
import type { SearchSuggestionsStatus } from './search-types'

const SUGGESTION_DEBOUNCE_MS = 180
const MIN_SUGGESTION_QUERY_LENGTH = 2

type SearchSuggestionsResponse = {
  products: ProductSummary[]
}

export function SearchAutocomplete({
  initialQuery,
  onNavigate,
}: {
  initialQuery: string
  onNavigate?: () => void
}) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<ProductSummary[]>([])
  const [suggestionsStatus, setSuggestionsStatus] =
    useState<SearchSuggestionsStatus>('idle')
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)

  useEffect(() => {
    const query = inputValue.trim()

    if (!isSuggestionsOpen || query.length < MIN_SUGGESTION_QUERY_LENGTH) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setSuggestionsStatus('loading')

      try {
        const response = await fetch(
          `/api/search/suggestions?${new URLSearchParams({ q: query }).toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Search suggestions request failed')
        }

        const data = (await response.json()) as SearchSuggestionsResponse
        const nextSuggestions = Array.isArray(data.products)
          ? data.products
          : []

        setSuggestions(nextSuggestions)
        setSuggestionsStatus(nextSuggestions.length > 0 ? 'results' : 'empty')
        setActiveSuggestionIndex(-1)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setSuggestions([])
        setSuggestionsStatus('error')
        setActiveSuggestionIndex(-1)
      }
    }, SUGGESTION_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [inputValue, isSuggestionsOpen])

  function closeSuggestions() {
    setIsSuggestionsOpen(false)
    setActiveSuggestionIndex(-1)
  }

  function navigateToSearch(query: string) {
    const nextQuery = query.trim()
    const nextUrl = nextQuery
      ? `/search?${new URLSearchParams({ q: nextQuery }).toString()}`
      : '/search'

    closeSuggestions()
    onNavigate?.()
    router.push(nextUrl)
  }

  function navigateToProduct(product: ProductSummary) {
    closeSuggestions()
    onNavigate?.()
    router.push(`/products/${product.handle}`)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value
    const nextQuery = nextValue.trim()

    setInputValue(nextValue)
    setIsSuggestionsOpen(nextQuery.length >= MIN_SUGGESTION_QUERY_LENGTH)
    setSuggestions([])
    setSuggestionsStatus(
      nextQuery.length >= MIN_SUGGESTION_QUERY_LENGTH ? 'loading' : 'idle',
    )
    setActiveSuggestionIndex(-1)
  }

  function handleInputFocus() {
    if (inputValue.trim().length >= MIN_SUGGESTION_QUERY_LENGTH) {
      setIsSuggestionsOpen(true)
      if (suggestionsStatus === 'idle') {
        setSuggestionsStatus('loading')
      }
    }
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const nextTarget = event.relatedTarget

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return
    }

    closeSuggestions()
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    navigateToSearch(inputValue)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    const input = event.currentTarget.querySelector<HTMLInputElement>(
      '[data-search-input]',
    )

    if (event.key === 'Escape') {
      closeSuggestions()
      return
    }

    if (event.target !== input) return

    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      setIsSuggestionsOpen(true)
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
      )
      return
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      setIsSuggestionsOpen(true)
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      )
      return
    }

    if (event.key !== 'Enter') return

    event.preventDefault()

    const activeSuggestion = suggestions[activeSuggestionIndex]

    if (isSuggestionsOpen && activeSuggestion) {
      navigateToProduct(activeSuggestion)
      return
    }

    navigateToSearch(inputValue)
  }

  function handleSuggestionMouseDown(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
  }

  function handleSuggestionClick() {
    closeSuggestions()
    onNavigate?.()
  }

  return (
    <SearchForm
      activeSuggestionIndex={activeSuggestionIndex}
      isSuggestionsOpen={isSuggestionsOpen}
      onBlur={handleBlur}
      onInputChange={handleInputChange}
      onInputFocus={handleInputFocus}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      onSuggestionClick={handleSuggestionClick}
      onSuggestionMouseDown={handleSuggestionMouseDown}
      onSuggestionMouseEnter={setActiveSuggestionIndex}
      suggestions={suggestions}
      suggestionsStatus={suggestionsStatus}
      value={inputValue}
    />
  )
}
