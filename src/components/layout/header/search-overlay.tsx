'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useRef, Suspense } from 'react'

import { Eyebrow, IconButton } from '@/components/ui'

import { Search as SearchWithAutocomplete } from './search'
import { SearchForm } from './search-form'

const POPULAR_SUGGESTIONS = [
  'Earl Grey',
  'Matcha',
  'Sticky Chai',
  'Organic Peppermint',
  'Lemon Myrtle',
  'Sleep blends',
  'Bulk tea bags',
  'Turmeric',
]

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus the search input when the overlay opens
  useEffect(() => {
    if (!open) return

    const inputEl = panelRef.current?.querySelector<HTMLInputElement>(
      '[data-search-input]',
    )
    if (inputEl) {
      // slight delay so the panel has rendered
      const id = window.setTimeout(() => inputEl.focus(), 30)
      return () => window.clearTimeout(id)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed inset-x-0 top-0 z-70 bg-paper border-b border-hairline shadow-4"
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
      >
        <div className="max-w-wide mx-auto px-gutter py-6">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <IconButton
              aria-label="Close search"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="hover:bg-brand-tint hover:text-brand"
            >
              <X className="size-5" aria-hidden="true" strokeWidth={1.8} />
            </IconButton>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-3 border-b-2 border-ink pb-4 mb-6">
            <Search
              className="size-6 text-ink-faint shrink-0"
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <div className="flex-1">
              <Suspense fallback={<SearchForm />}>
                <SearchWithAutocomplete />
              </Suspense>
            </div>
          </div>

          {/* Popular suggestions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Eyebrow tone="muted" rule={false}>
              Popular
            </Eyebrow>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUGGESTIONS.map((suggestion) => (
                <a
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  onClick={onClose}
                  className="rounded-full border border-hairline bg-card px-3.5 py-2 type-label text-ink hover:bg-brand hover:text-paper transition-colors"
                >
                  {suggestion}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 z-65 bg-ink/35 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={onClose}
      />
    </>
  )
}
