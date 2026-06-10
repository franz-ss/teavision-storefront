/**
 * MOCKUP — 404 Page Design Concepts
 *
 * Current: plain card with green serif "404" numeral + two buttons.
 * Owner requested: on-brand treatment using existing brand motifs
 * (BrushCircle / Stamp / tea illustrations), creative but NOT overdesigned,
 * with helpful links to collections and search.
 *
 * Owner: review Concept A and Concept B, then approve a direction before
 * Task 2 implements the change in not-found.tsx.
 *
 * Concepts:
 *   A — Illustrated: BrushCircle teapot + warm paper background + helpful links
 *   B — Typographic: Large ink "404" + Stamp motif + warm section layout
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button, Eyebrow } from '@/components/ui'
import { BrushCircle } from '@/components/homepage/brush-circle/brush-circle'
import { Stamp } from '@/components/homepage/stamp/stamp'
import { Section } from '@/components/ui/section/section'
import { cn } from '@/lib/utils'

// ─── Concept A: Illustrated — BrushCircle + warm paper bg ───────────────────

function ConceptA404() {
  return (
    <Section.Root tone="sunken" spacing="default">
      <Section.Container>
        <div className="flex flex-col items-center text-center gap-8 py-8">
          {/* Floating illustration */}
          <div className="relative">
            <BrushCircle illo="teapot" className="w-[clamp(160px,20vw,220px)]" />
          </div>

          {/* Eyebrow + heading */}
          <div className="max-w-sm">
            <Eyebrow tone="muted" className="justify-center mb-4" rule={false}>
              Nothing to steep here
            </Eyebrow>
            <h1 className="type-heading-01 text-ink">
              This page has gone cold
            </h1>
            <p className="type-body text-ink-soft mt-3">
              The page you&rsquo;re looking for has moved, been removed, or
              never existed. Let&rsquo;s find you something worth brewing.
            </p>
          </div>

          {/* Helpful actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/" variant="brand">
              Go home
            </Button>
            <Button href="/collections/all" variant="secondary">
              Browse products
            </Button>
            <Button href="/search" variant="ghost">
              Search
            </Button>
          </div>

          {/* Quick collection links */}
          <div className="border-t border-hairline pt-6 w-full max-w-sm">
            <p className="type-label text-ink-faint mb-3">Popular collections</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Teas', 'Herbs & Spices', 'Bulk Bags', 'Matcha', 'Chai'].map((label) => (
                <a
                  key={label}
                  href={`/collections/${label.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                  className={cn(
                    'rounded-full border border-hairline bg-card px-3.5 py-2 type-label text-ink',
                    'hover:bg-brand hover:text-paper transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}

// ─── Concept B: Typographic — large "404" + Stamp motif ─────────────────────

function ConceptB404() {
  return (
    <Section.Root tone="surface" spacing="default">
      <Section.Container>
        <div className="flex flex-col items-center text-center gap-6 py-8">
          {/* Large typographic 404 with stamp in the corner */}
          <div className="relative inline-flex items-center justify-center">
            <p
              aria-hidden="true"
              className={cn(
                'font-display font-medium text-ink-faint select-none',
                'text-[clamp(6rem,20vw,12rem)] leading-none tracking-tight',
              )}
            >
              404
            </p>
            {/* Stamp rotated slightly — decorative, aria-hidden inside Stamp */}
            <div className="absolute -right-8 -top-4 rotate-12 opacity-80">
              <Stamp top="Lost" bottom="Teavision" tone="brand" id="not-found" />
            </div>
          </div>

          {/* Eyebrow + heading */}
          <div className="max-w-sm -mt-2">
            <Eyebrow tone="brand" className="justify-center mb-4">
              Page not found
            </Eyebrow>
            <h1 className="type-heading-02 text-ink">
              Something&rsquo;s gone astray
            </h1>
            <p className="type-body text-ink-soft mt-3">
              The page you&rsquo;re looking for has moved or never existed.
              Head back or browse our range.
            </p>
          </div>

          {/* Helpful actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mt-2">
            <Button href="/" variant="brand">
              Go home
            </Button>
            <Button href="/collections/all" variant="secondary">
              Browse products
            </Button>
            <Button href="/search" variant="ghost">
              Search
            </Button>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}

// ─── Storybook meta ──────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Pages/404 Concepts (Mockup)',
  tags: ['mockup'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
}

export default meta

type Story = StoryObj

/**
 * CONCEPT A — Illustrated 404
 *
 * - BrushCircle teapot illustration (floating animation) as the hero motif
 * - Warm sunken background (bg-paper-2) — distinct from the page but on-brand
 * - "Nothing to steep here" / "This page has gone cold" — tea-brand copy
 * - Three action buttons: home, browse products, search
 * - Quick collection pill links below (Earl Grey, Herbs, Bulk Bags, etc.)
 * - On-brand, warm, not overdesigned
 */
export const ConceptA: Story = {
  render: () => <ConceptA404 />,
  name: 'Concept A — Illustrated (BrushCircle)',
}

/**
 * CONCEPT B — Typographic 404
 *
 * - Large faint ink "404" numeral as the centrepiece (display font, no color)
 * - Brand-tone Stamp ("Lost / Teavision") rotated over the numeral — subtle motif
 * - Eyebrow + heading on white paper background — clean and minimal
 * - Three action buttons: home, browse products, search
 * - More restrained than Concept A; suits a minimal aesthetic
 */
export const ConceptB: Story = {
  render: () => <ConceptB404 />,
  name: 'Concept B — Typographic (Stamp motif)',
}
