/**
 * MOCKUP — Search Overlay Design Concepts
 *
 * These stories preview redesign directions for the search overlay input.
 * Current issues: `clamp(1.4rem,3vw,2.2rem)` serif scale reads oversized;
 * `border-b-2 border-ink` was an invention rather than a token treatment.
 *
 * Owner: review Concept A and Concept B, then approve a direction before
 * Task 2 implements the change in production components.
 *
 * Concepts:
 *   A — Calm: comfortable base-scale input, soft focus ring matching .field
 *   B — Display-constrained: medium-serif scale, soft focus ring (midpoint)
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { X, Search } from 'lucide-react'

import { Eyebrow, IconButton } from '@/components/ui'
import { cn } from '@/lib/utils'

// ─── shared fixtures ────────────────────────────────────────────────────────

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

// ─── Concept A: calm base-scale, shared .field focus ring ───────────────────

type ConceptAProps = {
  placeholder?: string
}

function ConceptAOverlay({
  placeholder = 'Search 1,000+ teas, herbs & spices…',
}: ConceptAProps) {
  return (
    <div className="bg-paper border-hairline shadow-4 w-full border-b">
      <div className="max-w-wide px-gutter mx-auto pt-5 pb-7">
        {/* Close button row */}
        <div className="mb-3 flex justify-end">
          <IconButton
            aria-label="Close search"
            variant="ghost"
            size="md"
            className="hover:bg-brand-tint hover:text-brand"
          >
            <X className="size-5" aria-hidden="true" strokeWidth={1.8} />
          </IconButton>
        </div>

        {/* Search input row — calm scale, shared .field focus ring */}
        <div className="relative mb-6">
          <input
            type="search"
            placeholder={placeholder}
            className={cn(
              // Comfortable body scale — no oversized clamp
              'type-body',
              // Shared .field treatment from TextInput
              'border-hairline bg-card text-ink placeholder:text-ink-faint rounded-sm border',
              // Sizing — generous vertical padding, room for search icon
              'min-h-12 w-full py-3.5 pr-12 pl-4 transition-colors',
              // Focus: brand border + green glow (same as TextInput / Textarea)
              'focus:border-brand focus:shadow-focus focus:ring-0 focus:outline-none',
            )}
            defaultValue=""
            autoComplete="off"
          />
          <IconButton
            type="submit"
            variant="ghost"
            size="sm"
            aria-label="Submit search"
            className="text-ink-faint hover:text-brand absolute top-1/2 right-0 size-12 -translate-y-1/2"
          >
            <Search className="size-5" aria-hidden="true" strokeWidth={1.8} />
          </IconButton>
        </div>

        {/* Popular suggestions */}
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow tone="muted" rule={false}>
            Popular
          </Eyebrow>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((suggestion) => (
              <span
                key={suggestion}
                className="border-hairline bg-card type-label text-ink hover:bg-brand hover:text-paper cursor-pointer rounded-full border px-3.5 py-2 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Concept B: constrained display scale, soft focus ring (midpoint) ───────

function ConceptBOverlay({
  placeholder = 'Search 1,000+ teas, herbs & spices…',
}: ConceptAProps) {
  return (
    <div className="bg-paper border-hairline shadow-4 w-full border-b">
      <div className="max-w-wide px-gutter mx-auto pt-5 pb-7">
        {/* Close button row */}
        <div className="mb-3 flex justify-end">
          <IconButton
            aria-label="Close search"
            variant="ghost"
            size="md"
            className="hover:bg-brand-tint hover:text-brand"
          >
            <X className="size-5" aria-hidden="true" strokeWidth={1.8} />
          </IconButton>
        </div>

        {/* Search input row — constrained serif at 1.125rem (18px), focus ring */}
        <div className="relative mb-6">
          <input
            type="search"
            placeholder={placeholder}
            className={cn(
              // Modest serif — readable but not dominating
              'font-display text-lg',
              // Shared .field treatment
              'border-hairline text-ink placeholder:text-ink-faint rounded-sm border bg-transparent',
              // Sizing
              'min-h-14 w-full py-4 pr-12 pl-4 transition-colors',
              // Focus: brand border + green glow
              'focus:border-brand focus:shadow-focus focus:ring-0 focus:outline-none',
            )}
            defaultValue=""
            autoComplete="off"
          />
          <IconButton
            type="submit"
            variant="ghost"
            size="sm"
            aria-label="Submit search"
            className="text-ink-faint hover:text-brand absolute top-1/2 right-0 size-14 -translate-y-1/2"
          >
            <Search className="size-5" aria-hidden="true" strokeWidth={1.8} />
          </IconButton>
        </div>

        {/* Popular suggestions — two-row grid on wide viewports */}
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow tone="muted" rule={false}>
            Popular
          </Eyebrow>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((suggestion) => (
              <span
                key={suggestion}
                className="border-hairline bg-card type-label text-ink hover:bg-brand hover:text-paper cursor-pointer rounded-full border px-3.5 py-2 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Storybook meta ──────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Layout/Header/Search Overlay Concepts (Mockup)',
  tags: ['mockup'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

/**
 * CONCEPT A — Calm base-scale input
 *
 * - Input: `type-body` (15–16 px body text, Hanken Grotesk)
 * - Focus: shared `.field` treatment — hairline border, brand border + green
 *   glow shadow on focus (same as TextInput / Textarea / contact form)
 * - No custom border hack; no oversized serif display scale
 * - Popular pill layout unchanged
 */
export const ConceptA: Story = {
  render: () => <ConceptAOverlay />,
  name: 'Concept A — Calm base-scale',
}

/**
 * CONCEPT B — Constrained serif scale (midpoint)
 *
 * - Input: `font-display text-lg` (18 px Spectral) — a readable serif nod
 *   without the clamp(1.4rem…2.2rem) dominance of the current design
 * - Focus: same soft brand border + green glow shadow as Concept A
 * - Popular pill layout unchanged
 */
export const ConceptB: Story = {
  render: () => <ConceptBOverlay />,
  name: 'Concept B — Constrained serif scale',
}

/**
 * CONCEPT A — with a typed query (focus-state preview)
 */
export const ConceptAWithQuery: Story = {
  render: () => <ConceptAOverlay placeholder="" />,
  name: 'Concept A — with query (focused state)',
}
