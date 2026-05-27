import Form from 'next/form'
import { Search } from 'lucide-react'

import { IconButton, TextInput } from '@/components/ui'
import { cn } from '@/lib/utils'

import { SUGGESTIONS_LISTBOX_ID } from './search-constants'
import { SearchSuggestions } from './search-suggestions'
import type { SearchFormProps } from './search-types'
export type { SearchSuggestionsStatus } from './search-types'

export function SearchForm({
  activeSuggestionIndex = -1,
  className,
  defaultQuery = '',
  isSuggestionsOpen = false,
  onBlur,
  onInputChange,
  onInputFocus,
  onKeyDown,
  onSubmit,
  onSuggestionMouseDown,
  onSuggestionMouseEnter,
  suggestions = [],
  suggestionsStatus = 'idle',
  value,
}: SearchFormProps) {
  const activeDescendant =
    isSuggestionsOpen &&
    suggestionsStatus === 'results' &&
    activeSuggestionIndex >= 0
      ? `${SUGGESTIONS_LISTBOX_ID}-${activeSuggestionIndex}`
      : undefined
  const shouldShowSuggestions =
    isSuggestionsOpen && suggestionsStatus !== 'idle'
  const controls =
    suggestionsStatus === 'results' && suggestions.length > 0
      ? SUGGESTIONS_LISTBOX_ID
      : undefined

  return (
    <Form
      action="/search"
      role="search"
      aria-label="Site search"
      className={cn('relative w-full', className)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onSubmit={onSubmit}
    >
      <TextInput
        key={value === undefined ? defaultQuery : undefined}
        role="combobox"
        aria-label="Search products and articles"
        aria-autocomplete="list"
        aria-controls={controls}
        aria-expanded={isSuggestionsOpen}
        aria-activedescendant={activeDescendant}
        autoComplete="off"
        className="border-default bg-canvas min-h-12 rounded-lg py-0 pr-12 pl-5"
        data-search-input
        defaultValue={value === undefined ? defaultQuery : undefined}
        enterKeyHint="search"
        inputMode="search"
        name="q"
        onChange={onInputChange}
        onFocus={onInputFocus}
        placeholder="Find products and articles"
        type="search"
        value={value}
      />
      <IconButton
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute top-1/2 right-1 size-10 -translate-y-1/2"
        aria-label="Submit search"
      >
        <Search className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </IconButton>
      {shouldShowSuggestions && (
        <SearchSuggestions
          activeSuggestionIndex={activeSuggestionIndex}
          onSuggestionMouseDown={onSuggestionMouseDown}
          onSuggestionMouseEnter={onSuggestionMouseEnter}
          suggestions={suggestions}
          status={suggestionsStatus}
        />
      )}
    </Form>
  )
}
