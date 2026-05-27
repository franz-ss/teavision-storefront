import type {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react'

import type { ProductSummary } from '@/lib/shopify/types'

export type SearchSuggestionsStatus =
  | 'idle'
  | 'loading'
  | 'results'
  | 'empty'
  | 'error'

export type SearchFormProps = {
  activeSuggestionIndex?: number
  className?: string
  defaultQuery?: string
  isSuggestionsOpen?: boolean
  onBlur?: FocusEventHandler<HTMLFormElement>
  onInputChange?: ChangeEventHandler<HTMLInputElement>
  onInputFocus?: FocusEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLFormElement>
  onSubmit?: FormEventHandler<HTMLFormElement>
  onSuggestionMouseDown?: MouseEventHandler<HTMLAnchorElement>
  onSuggestionMouseEnter?: (index: number) => void
  suggestions?: ProductSummary[]
  suggestionsStatus?: SearchSuggestionsStatus
  value?: string
}
