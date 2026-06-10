'use client'

import { X } from 'lucide-react'
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
      {/* Backdrop scrim — behind panel but above page content */}
      <div
        className="fixed inset-0 z-65 bg-ink/35 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed inset-x-0 top-0 z-70 bg-paper border-b border-hairline shadow-4"
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
      >
        <div className="max-w-wide mx-auto px-gutter pt-5 pb-7">
          {/* Close button row */}
          <div className="flex justify-end mb-3">
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

          {/* Search input row — serif display + bottom 2px border */}
          <div className="border-b-2 border-ink mb-6">
            <Suspense fallback={<SearchForm />}>
              <SearchWithAutocomplete />
            </Suspense>
          </div>

          {/* Popular suggestions */}
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow tone="muted" rule={false}>
              Popular
            </Eyebrow>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUGGESTIONS.map((suggestion) => (
                <a
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  onClick={onClose}
                  className="focus-visible:ring-ring rounded-full border border-hairline bg-card px-3.5 py-2 type-label text-ink hover:bg-brand hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {suggestion}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
