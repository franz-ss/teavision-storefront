---
phase: 11-full-visual-redesign
plan: 12
subsystem: blog
tags: [blog, rich-content, design-tokens, restyling]
dependency_graph:
  requires: [11-02, 11-03]
  provides: [blog-surface-restyled, rich-content-mappers-migrated]
  affects: [tea-journal-listing, article-pages, portable-text, html-content]
tech_stack:
  added: []
  patterns:
    [
      Eyebrow component,
      Section.Root tone=brand/.sunken,
      type-mono-meta labels,
      font-display headings,
      border-hairline tables,
      brand pill tags,
    ]
key_files:
  created: []
  modified:
    - src/lib/shopify/html-content.ts
    - src/components/blog/portable-text/portable-text.tsx
    - src/app/(storefront)/blogs/[blog]/[article]/page.tsx
    - src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx
    - src/components/blog/hero/hero.tsx
    - src/components/blog/hero/search-form.tsx
    - src/components/blog/tag-filter-nav/tag-filter-nav.tsx
    - src/components/blog/article-results/article-results.tsx
    - src/components/blog/pagination/pagination.tsx
    - src/components/blog/featured-articles/featured-articles.tsx
    - src/components/blog/empty-state/empty-state.tsx
decisions:
  - 'Blog hero uses Section.Root tone=brand (not brandStrong); image at 35% opacity behind brand-deep band'
  - 'Blockquotes: border-l-2 border-gold pl-5 font-display italic — no rounded background; matches mockup editorial treatment'
  - 'Article results/featured sections use tone=sunken (paper-2) to contrast with the brand hero band above'
  - 'EmptyState: Lucide Leaf icon instead of emoji; font-display heading'
metrics:
  duration: 6m
  completed_date: '2026-06-10'
  tasks: 3
  files: 11
---

# Phase 11 Plan 12: Blog / Tea Journal Restyling Summary

Blog / Tea Journal surface and both hidden rich-content class mappers fully migrated to new OKLCH design tokens — blockquotes use gold left-border serif treatment, body text `text-ink-soft 1.02rem/1.6`, headings `text-ink font-display`, links `text-brand`, tables `border-hairline-2`, with sanitization pipeline and all behavioral contracts untouched.

## Tasks Completed

| Task | Name                                                               | Commit  | Files                                                                                                                      |
| ---- | ------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | Rich-content class maps (html-content.ts + portable-text)          | 36ef193 | html-content.ts, portable-text.tsx                                                                                         |
| 2    | Article page + listing page                                        | 2b74648 | article/page.tsx, listing-page.tsx                                                                                         |
| 3    | Blog components (hero, tags, results, pagination, featured, empty) | ef3b68f | hero.tsx, search-form.tsx, tag-filter-nav.tsx, article-results.tsx, pagination.tsx, featured-articles.tsx, empty-state.tsx |

## What Was Built

### Task 1: Rich-content class maps

- **html-content.ts**: All 3 variants (page, article, compact) migrated. Blockquotes: `font-display italic border-l-2 border-gold pl-5 text-ink`. Body/paragraphs: `text-ink-soft text-[1.02rem] leading-[1.6]`. Headings: `text-ink` per type-heading scale. Links: `text-brand hover:text-brand-deep underline underline-offset-2`. Tables: `border-hairline-2` cells, `type-mono-meta text-ink-faint` headers. Captions: `type-mono-meta text-ink-faint`.
- **portable-text.tsx**: Same class migration. `code` marks use `bg-paper-2 text-ink`. Callout aside uses `bg-card border-hairline`. Table cells use `border-b border-hairline-2`. Image figcaption uses `type-mono-meta text-ink-faint`.
- Sanitize-html config, allowed tags/attributes, `wrapTablesWithScrollRegion`, exported function signatures: **byte-identical**.

### Task 2: Article page

- Breadcrumb: `type-mono-meta text-ink-faint`, link `text-brand hover:text-brand-deep`
- Tag pills: `type-mono-meta text-brand border-hairline bg-card hover:border-brand`, `min-h-11` touch target
- Title: `font-display text-[clamp(2rem,4vw,3.4rem)]` — editorial scale per §5.9
- Meta row: `type-mono-meta text-ink-faint`
- Hero image container: `bg-paper-2` (was bg-surface-sunken)
- Excerpt: `type-lede text-ink-soft italic`
- Adjacent-article nav: `border-hairline`, headings `text-ink`, labels `type-mono-meta text-ink-faint`
- Back link: `text-brand hover:text-brand-deep`
- Listing page: Suspense fallback uses `tone="sunken"` + `text-ink-soft`

### Task 3: Blog components

- **Hero**: `tone="brand"`, gold Eyebrow "Tea Journal", `font-display text-paper` title `max-w-[16ch]`, `type-lede text-paper/85` copy, hero image at 35% opacity
- **TagFilterNav**: Active `bg-brand text-paper border-brand`, idle `border-hairline bg-card text-ink`, hover `bg-brand-tint text-brand`; URL-param tag state preserved
- **Pagination**: `rounded-full min-h-11`, active `bg-brand text-paper`, idle `border-hairline bg-card`, `aria-current` preserved
- **ArticleResults/FeaturedArticles**: `tone="sunken"`, Eyebrow muted "Tea Journal", `type-heading-02 text-ink`
- **EmptyState**: Lucide Leaf icon `text-ink-faint`, `font-display` heading, `text-ink-soft` copy
- **SearchForm**: `bg-card border-hairline text-ink placeholder:text-ink-faint`

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Minor adjustments

1. `text-strong` → `text-ink` throughout (old alias removed per migration table §3)
2. `bg-surface` → `bg-card` (card/input surfaces); `bg-surface-sunken` → `bg-paper-2`
3. Hero used `tone="brandStrong"` — migrated to `tone="brand"` per §3 removal of brandStrong
4. `type-display-01` not used in blog files; article title uses explicit `font-display clamp(2rem,4vw,3.4rem)` per §5.9 spec
5. `text-on-brand` → `text-paper` throughout

## Known Stubs

None. All data flows (Shopify HTML, Sanity Portable Text, article body, tag params, pagination math) are wired and functional.

## Threat Flags

No new network endpoints, auth paths, or schema changes introduced. Sanitize-html config unchanged — T-11-28 and T-11-29 mitigations confirmed (acceptance criteria: 0 old tokens in html-content.ts, sanitization byte-identical).

## Self-Check: PASSED

Files confirmed:

- `src/lib/shopify/html-content.ts` — FOUND
- `src/components/blog/portable-text/portable-text.tsx` — FOUND
- `src/app/(storefront)/blogs/[blog]/[article]/page.tsx` — FOUND
- `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx` — FOUND
- `src/components/blog/hero/hero.tsx` — FOUND
- `src/components/blog/tag-filter-nav/tag-filter-nav.tsx` — FOUND
- `src/components/blog/article-results/article-results.tsx` — FOUND
- `src/components/blog/pagination/pagination.tsx` — FOUND
- `src/components/blog/featured-articles/featured-articles.tsx` — FOUND
- `src/components/blog/empty-state/empty-state.tsx` — FOUND

Commits confirmed:

- 36ef193 — Task 1 FOUND
- 2b74648 — Task 2 FOUND
- ef3b68f — Task 3 FOUND
