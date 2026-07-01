import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  SubmitEventHandler,
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
  inputClassName?: string
  defaultQuery?: string
  isSuggestionsOpen?: boolean
  onBlur?: FocusEventHandler<HTMLFormElement>
  onInputChange?: ChangeEventHandler<HTMLInputElement>
  onInputFocus?: FocusEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLFormElement>
  onSubmit?: SubmitEventHandler<HTMLFormElement>
  onSuggestionClick?: MouseEventHandler<HTMLAnchorElement>
  onSuggestionMouseDown?: MouseEventHandler<HTMLAnchorElement>
  onSuggestionMouseEnter?: (index: number) => void
  suggestions?: ProductSummary[]
  suggestionsStatus?: SearchSuggestionsStatus
  value?: string
}
