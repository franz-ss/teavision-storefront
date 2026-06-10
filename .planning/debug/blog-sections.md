---
status: diagnosed
trigger: 'Phase 11 UAT test 14 — blog/Tea Journal listing: missing newsletter band + contact section, large vertical gaps, image optimization check'
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — see Resolution
test: static analysis complete
expecting: n/a
next_action: hand off to planner (goal: find_root_cause_only, no fixes applied)

## Symptoms

expected: Blog listing ends with (a) black newsletter band "Explore the World of Tea with Monthly Newsletters" with teapot brush illustration + "Business Teavision" stamp, and (b) contact section "Need help? Speak with our Ingredients Experts Today." Even vertical rhythm between bands. Optimized article images.
actual: Listing ends with a small "Tea Journal in your inbox" card (`NewsletterSignup` ui primitive). No ink-motif newsletter band, no contact section. Large empty vertical gaps between featured grid, "Latest Articles" band, and the newsletter card.
errors: none (visual/structural defects)
reproduction: visit /blogs/[blog] (Tea Journal listing) and compare against production teavision.com.au blog
started: redesign phase — sections never mounted on blog listing route

## Eliminated

- hypothesis: ArticleCard images are unoptimized (raw <img>, missing sizes, eager loading)
  evidence: src/components/ui/article-card/article-card.tsx uses next/image with explicit width/height, responsive `sizes` per variant ('(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' for default 3-col grid; '(min-width: 768px) 50vw, 100vw' for featured 2-col), default lazy loading, and Next 16 `preload` prop only on the first featured card (FeaturedArticles passes preload={index === 0}). Hero (src/components/blog/hero/hero.tsx) uses fill + sizes="100vw" + preload for the LCP image. `preload` is the correct Next 16 prop (priority deprecated in v16.0.0 per node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md line 293/1402). NO IMAGE ARTIFACTS.
  timestamp: 2026-06-10

- hypothesis: Intra-section margins (TagFilterNav mb-8, Pagination mt-12/pt-8, heading mb-6) cause the large gaps
  evidence: These are modest, intentional in-band rhythm values. The dominant gap is the doubled inter-band `py-section` (see Evidence).
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: src/app/(storefront)/blogs/[blog]/\_components/listing-content.tsx
  found: Page tail renders only `<Section.Root tone="sunken"><Section.Container variant="compact"><NewsletterSignup action={sendNewsletterSignupAction} /></Section.Container></Section.Root>`. No ink/inverse newsletter band, no Contact section mounted.
  implication: Missing sections are a route-composition gap, not missing components.

- timestamp: 2026-06-10
  checked: src/components/homepage/supply-chain/supply-chain.tsx
  found: `Section.Root tone="inverse"` (bg-ink black band) with `<BrushCircle illo="handshake" />` + center copy + `<Stamp top="Business" bottom="Teavision" />` in a 3-column grid. This is the BrushCircle+Stamp "ink motif band" treatment the UAT describes — but its copy is the business CTA ("Let the experts help grow your business"), not the newsletter copy, and it has no form.
  implication: SupplyChain is the layout/motif template; production blog band = this treatment with `illo="teapot"` + newsletter copy/form.

- timestamp: 2026-06-10
  checked: src/components/homepage/brush-circle/brush-circle.tsx
  found: ILLO_MAP already includes `teapot: { src: '/images/illo-teapot.png', ... }`. `illo="teapot"` is currently only used in brush-circle.stories.tsx — nowhere in app code.
  implication: The teapot asset and variant exist and are ready to use; no new asset work needed.

- timestamp: 2026-06-10
  checked: src/components/homepage/newsletter/newsletter.tsx (HomepageNewsletter)
  found: Newsletter copy ("Explore the world of tea, monthly.") + `HomepageNewsletterForm`, rendered as a `bg-brand-deep` rounded card inside `Section.Root tone="sunken" className="pt-0"`. No BrushCircle, no Stamp. Hardcoded `pt-0` couples it to its homepage position (immediately after Cta band).
  implication: HomepageNewsletter has the right copy + form but the wrong visual treatment (brand-deep card, not full-bleed ink band with motifs). The exact production band (newsletter copy + teapot BrushCircle + Stamp + form) does not exist as a single component — it must be composed.

- timestamp: 2026-06-10
  checked: src/components/homepage/contact/contact.tsx
  found: `Contact({ action })` — `Section.Root id="need-help" tone="inverse"` with "Speak with our ingredients experts." heading, phone/email methods, and `HomepageContactForm`. Matches the production "Need help? Speak with our Ingredients Experts Today." section. Requires `action` prop; homepage passes `submitContactFormAction` from `@/lib/contact/actions`.
  implication: Contact is directly mountable on the blog listing — pass `submitContactFormAction`.

- timestamp: 2026-06-10
  checked: src/app/(storefront)/pages/certifications/\_components/page-content.tsx
  found: Already imports `ProofPoints` and `SupplyChain` from `@/components/homepage` on a non-homepage route.
  implication: Cross-route reuse of homepage/ components has precedent in this codebase, but per docs/conventions.md folder map, `src/components/homepage/` is "Homepage feature sections, homepage-only UI helpers" — strict compliance would require promoting reused components (Contact, BrushCircle, Stamp, newsletter band) out of homepage/ (e.g. to a shared marketing/ domain or ui/) rather than widening the precedent.

- timestamp: 2026-06-10
  checked: src/app/globals.css + src/components/ui/section/section.tsx
  found: `--spacing-section: clamp(4rem, 9vw, 8.125rem)`. Section.Root default spacing = `py-section` (both top and bottom). The blog listing stacks THREE consecutive `Section.Root tone="sunken"` bands: FeaturedArticles (featured-articles.tsx line 15), ArticleResults (article-results.tsx line 29), and the NewsletterSignup wrapper (listing-content.tsx line 72). Adjacent same-tone bands produce 2 × py-section (up to ~260px at desktop) of empty bg-paper-2 between content blocks, with no visual boundary to justify it.
  implication: The "large empty vertical gaps" are doubled inter-band padding between visually continuous sunken bands. Homepage solves the same problem with `className="pt-0"` on the follow-on band (newsletter.tsx line 12).

- timestamp: 2026-06-10
  checked: src/components/blog/pagination/pagination.tsx, tag-filter-nav.tsx, article-list.tsx
  found: In-band spacing is moderate (Pagination: mt-12 + border-t pt-8; TagFilterNav: mb-8; results heading: mb-6) and Pagination returns null when totalPages <= 1. These are not the gap source.
  implication: Fix belongs at the Section.Root band level, not inside the components.

- timestamp: 2026-06-10
  checked: src/lib/contact/actions.ts exports
  found: `sendNewsletterSignupAction` (used by blog NewsletterSignup), `submitNewsletterSignupFormAction` (used by HomepageNewsletter), `submitContactFormAction` (used by homepage Contact). All exist and are importable from the blog route.
  implication: No new Server Actions needed to mount the sections.

## Resolution

root_cause: |

1. MISSING SECTIONS — composition gap in listing-content.tsx: the route tail renders only the small ui NewsletterSignup card. The production-matching pieces exist but are split across homepage components: the ink-band BrushCircle+Stamp treatment is SupplyChain (tone="inverse", Stamp "Business Teavision"); the teapot illo exists in BrushCircle's ILLO_MAP (unused in app code); the newsletter copy+form is HomepageNewsletter (different visual treatment, no motifs); the contact section is homepage Contact (directly reusable). No single component implements "newsletter band with teapot + stamp" — it must be composed. Conventions blocker: all candidates live in src/components/homepage/, defined as homepage-only; certifications already breaks this precedent.
2. SPACING — three stacked Section.Root tone="sunken" bands (FeaturedArticles, ArticleResults, newsletter wrapper) each contribute py-section (clamp(4rem,9vw,8.125rem)) top AND bottom, producing ~2× py-section (up to ~260px) of empty same-background space between adjacent content blocks.
3. IMAGES — no defect. ArticleCard and blog Hero use next/image correctly (sizes, lazy default, Next 16 preload only on LCP/first featured).
   fix: not applied (audit-only)
   verification: static analysis; no runtime testing performed
   files_changed: []
