# Phase 7: Collection Hero Production Parity - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning
**Source:** /gsd-explore session (Socratic) + live production + Liquid theme + codebase analysis
**Tracking:** Standalone phase — NOT added to ROADMAP.md / milestone state (user choice). Phase number 07 chosen as next free integer (06 is highest active; 03 is a parked blog dir).

<domain>
## Phase Boundary

Replace the wholesale-oriented collection hero in the Next storefront with a faithful, **convention-compliant native rebuild** of the live Shopify collection hero, scoped to `australian-certified-organic-tea` first and generalizable via per-handle config. Direct twin of the completed **Phase 4 "Footer 1:1 Parity"** — same milestone theme ("bring high-value legacy storefront behavior into the Next storefront"), same "live Shopify site is the visual source of truth" principle.

**In scope:**

- Full-width banner image at the top of the collection page (replacing the current small bordered inset `<figure>`).
- Consumer-forward heading + subheading + intro copy matching production.
- ACO (Australian Certified Organic) certification badge in the hero.
- Per-handle hero configuration so only opted-in collections change (regression-safe for all others).

**Out of scope (kept CMS-driven, NOT hand-coded):**

- The long SEO body content (4-card grid, FAQ, keyword strip). It stays sourced from Shopify `collection.description` and rendered through the **existing** `StoryDisclosure` read-more — matching production, where this content is _collapsed_ by default.
- Rendering Shopify's raw legacy HTML/inline `<style>` verbatim — explicitly rejected (violates conventions).

## Root Cause (the "why they differ" answer)

Production `https://www.teavision.com.au` is the **live Shopify Liquid theme** (`powered-by: Shopify`, theme `136234041431`) — not a Next.js deploy. Its collection hero is **raw HTML embedded in the Shopify `collection.description`**: a full-width `organic_tea…png` image, a hand-written `<style>` block (raw hex greens/tans), and a collapsed `<details class="organic-readmore">` whose "Explore…" text is a click-to-expand summary.

The Next rebuild **deliberately strips** all of this:

- `LEGACY_COLLECTION_BANNER_BLOCK_PATTERN` removes the `kk-collection-banner <h1>` block.
- `normalizeHtml()` strips every `<img>`, `<figure>`, `<picture>`, `<style>`, `<details>`, `<summary>`, and all `class`/`id`/`style` attributes, and downgrades `<h1>/<h2>` → `<h3>`.
- `hero.tsx` renders a bespoke **wholesale** hero instead (eyebrow "Wholesale collection", `<h1>{title}</h1>`, wholesale CTAs, `collection.featuredImage` in a bordered frame).

Introduced intentionally in `5e2dc5c feat(collections): revamp collection listing pages`. So the divergence is by design, not a regression — this phase partially and selectively reverses it for the visible hero only.
</domain>

<decisions>
## Implementation Decisions (LOCKED unless marked CONFIRM)

### Scope & approach

- **Full match of the _visible_ hero, rebuilt natively with design tokens.** The above-the-fold hero (image + heading + subheading + intro + ACO badge) matches production; the long SEO body stays CMS-driven in the read-more disclosure (production keeps it collapsed too). This reconciles the user's "Full match" choice with the convention-compliant "Option 1" recommendation.
- **Reject rendering raw Shopify description HTML** (inline `<style>`, raw hex, Bootstrap classes, `:contentReference[oaicite:N]` AI artifacts). Conventions hard-ban this and `normalizeHtml` exists precisely to strip it.
- **Do NOT hand-code the SEO sections** (grid/FAQ/keywords) into a React component — that copy is per-collection, CMS-owned, AI-generated, and belongs in Shopify. Keep it in the existing `StoryDisclosure`.

### Hero layout (faithful to production's visual order)

1. Breadcrumb — **keep** (production renders one; local already has one).
2. **Full-width banner image** — full-bleed, edge-to-edge, replacing the bordered rounded inset `<figure>`. Use the proven homepage-hero technique.
3. Heading **"Australian Certified Organic Tea"** + subheading **"Premium Organic Loose Leaf Tea Australia"** + the intro paragraph.
4. **ACO certification badge** rendered as a trust mark.
5. Existing read-more disclosure for the long SEO content (unchanged mechanism).
6. Toolbar + product grid (unchanged).

### Wholesale framing — **[CONFIRM with owner]**

- Per the "Full match" direction, **remove** the "Wholesale collection" eyebrow and the two prominent wholesale CTAs ("Request wholesale pricing" / "Ask about this range") from this consumer hero.
- **Default (safe):** preserve a single _demoted_ secondary link (e.g. "Wholesale enquiries" → `/pages/wholesale-account-request`) so the B2B conversion path isn't lost. Flagged for owner confirmation — if the owner wants a pure consumer hero, remove it entirely. (User is the developer, not the owner; live site is the brand reference.)

### Per-handle configuration (regression safety)

- Drive the new hero via **per-handle config**, reusing the existing `HERO_IMAGE_OVERRIDES` / `HIDDEN_HERO_INTRO_HANDLES` / `FORCED_RICH_DESCRIPTION_HANDLES` pattern in `page-helpers.ts`. Only `australian-certified-organic-tea` opts in now; every other collection renders exactly as today. This is the established codebase pattern (e.g. `tea-masters-selection-worlds-best-teas` is already special-cased).

### Conventions (non-negotiable — from CLAUDE.md / conventions.md)

- No raw hex in className; design tokens only. No `style={{}}` / inline styles / CSS modules.
- `cn()` from `@/lib/utils` for all className composition.
- Section layout via `Section.Root` / `Section.Container` (no raw page-level `<section>`).
- Warm/botanical palette — never cool grays.
- No default exports; no `any`; one component per file; Storybook story for any `src/components/` UI.
  </decisions>

<technical_findings>

## Technical Findings (in lieu of separate RESEARCH.md — already investigated)

### Closest analog (de-risks the full-bleed pattern)

`src/components/homepage/hero/hero.tsx` already implements the exact full-bleed banner pattern to mirror:

```tsx
<Section.Root tone="brandStrong" className="relative isolate overflow-hidden">
  <Image src={...} alt="" fill sizes="100vw" loading="eager" fetchPriority="high"
         className="absolute inset-0 -z-20 object-cover" />
  <div aria-hidden className="bg-inverse/50 absolute inset-0 -z-10" />
  <Section.Container>
    <h1 className="type-heading-01 text-on-brand md:type-display-02 ..." />
    <p className="type-body-lg text-on-brand/85 ..." />
    {/* trust marks <Image/> */}
  </Section.Container>
</Section.Root>
```

The collection hero can adopt this verbatim for the banner: full-bleed `Image fill object-cover`, scrim (`bg-inverse/50`), overlaid `text-on-brand` heading/subheading, ACO badge as a trust-mark image. (Decision for the planner: overlay text on the image like homepage hero, **or** place the heading block below a full-width image — production literally does image-then-heading-below. Either is acceptable; overlay is the more polished, on-brand choice. Recommend overlay with the scrim.)

### Production banner asset URLs (verified in raw HTML)

- **Banner image** (embedded in `collection.description` as `<p><img>`):
  `https://cdn.shopify.com/s/files/1/0786/8339/files/organic_tea_6d641d5d-32cf-4674-8426-4ac32368ad8c.png?v=1779248409`
- **ACO badge / logo** (collection `image` per JSON-LD / og:image):
  `https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_ACO_banner_logo_ff537bf6-ffad-4779-92d7-8371bbfc2a25_550x.jpg?v=1514957689`
- Use `getSizedShopifyImageUrl()` (already imported in `hero.tsx`) for sizing. Confirm the Shopify CDN host is allowed in `next.config` images config (other pages already render Shopify CDN images, so it should be).
- **Note for planner:** the big banner image is in the _description_ (which the app strips), NOT necessarily `collection.featuredImage`. The per-handle override should set the banner image URL explicitly rather than relying on `featuredImage`.

### Production copy (verbatim, for the visible hero)

- Heading: **Australian Certified Organic Tea**
- Subheading (uppercase, gold): **Premium Organic Loose Leaf Tea Australia**
- Intro: _"Discover Teavision's premium collection of Australian Certified Organic Tea — carefully sourced loose leaf tea blends crafted for tea lovers seeking purity, sustainability and exceptional quality. Our organic tea collection combines premium ingredients, ethical sourcing and natural flavour to create a truly refined tea experience."_
  (This already arrives via `collection.description` → `cleanHeroDescription()`; the existing `heroDescription` prop likely carries it. Verify and reuse rather than hardcoding where possible.)

### Color → token mapping (production hex → existing tokens; all warm/botanical, no cool grays)

| Production hex                     | Role                      | Token / utility                                                       |
| ---------------------------------- | ------------------------- | --------------------------------------------------------------------- |
| `#2f4a33` dark green               | headings                  | `text-brand` (steep-700) or `text-strong`; on image → `text-on-brand` |
| `#8a7a52` gold, uppercase, tracked | subheading                | `type-eyebrow` + `text-accent` (amber-700)                            |
| `#7b9b68` sage                     | accent rule / border-left | `border-brand` / steep-400 family                                     |
| `#f9f7f2`, `#f2efe7` cream         | panel bg                  | `bg-brand-subtle` (steep-50) / `bg-surface` / `bg-canvas`             |
| `#e5dfd2` tan                      | borders                   | `border-default`                                                      |
| `#4d4d4d`                          | body text                 | `text-default`                                                        |
| image text overlay                 | scrim                     | `bg-inverse/50` (homepage-hero pattern)                               |

- Headings already render in Fraunces (`--font-display`) via globals.css base styles; use `type-display-01`/`type-heading-01` scale.

### Files in scope

| File                                                                     | Current behavior                                                                                         | Change                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(storefront)/collections/[handle]/_components/hero.tsx`         | wholesale hero: eyebrow + `<h1>{title}</h1>` + heroDescription + 2 wholesale CTAs + bordered inset image | add full-bleed banner-image variant + subheading + ACO badge; remove wholesale eyebrow + dual CTAs (keep 1 demoted link per CONFIRM); branch by per-handle config                                                                |
| `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`         | `HERO_IMAGE_OVERRIDES`, `shouldShowCollectionIntroContent`, `normalizeHtml` (strips banner/img)          | add per-handle "consumer hero" config (banner image URL, subheading text, ACO badge URL, flag); leave `normalizeHtml` stripping intact (SEO stays in disclosure) — optionally a follow-up to preserve `<h3>/<h4>/<ul>` structure |
| `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` | builds `<Hero>` props; wires `StoryDisclosure` as `belowHeroImage`                                       | pass new hero props (banner image, subheading, ACO badge, consumer flag); StoryDisclosure wiring unchanged                                                                                                                       |
| (optional) `src/components/collection/collection-hero/*` + story         | hero currently route-local in `_components/` (no story)                                                  | planner's call: keep route-local, or promote to `src/components/collection/` with a Storybook story given visual complexity + variant matrix (recommended for coverage of consumer vs wholesale variants)                        |

### Existing read-more mechanism (keep)

`page-content.tsx` already renders `collection.descriptionHtml` (sanitized) through `StoryDisclosure` as `belowHeroImage`. This is the convention-compliant home for the long SEO content — no change required for parity, matching production's collapsed pattern.
</technical_findings>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Visual source of truth

- Live production page: `https://www.teavision.com.au/collections/australian-certified-organic-tea` (Shopify Liquid theme — the look to match)
- `../teavision-theme/sections/collection.liquid` — how production assembles the hero (`{% include 'breadcrumb' %}`, `collection.image`, `.rte` `collection.description`)

### Code to modify / mirror

- `src/components/homepage/hero/hero.tsx` — **closest analog**; full-bleed image + scrim + `text-on-brand` overlay pattern to reuse
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` — the hero to rebuild
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` — per-handle override config + `normalizeHtml`/`cleanHeroDescription`
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` — composition + `StoryDisclosure` wiring
- `src/components/ui/section/section.tsx` — `Section.Root` tones (`brand`/`brandStrong`/`transparent`), spacing, `Section.Container` widths
- `src/app/globals.css` — `@theme` token names + `type-*` utilities (color mapping source of truth)
- `src/lib/shopify/image-url.ts` — `getSizedShopifyImageUrl()` for the banner image

### Conventions (binding)

- `CLAUDE.md`, `AGENTS.md`, `docs/conventions.md` — token-only styling, `cn()`, Section layout, no default exports, no `any`, one component/file, Storybook for `src/components/`
  </canonical_refs>

<specifics>
## Success Criteria (must be TRUE) — for goal-backward verification

1. `/collections/australian-certified-organic-tea` renders a **full-width banner image** (the `organic_tea…png`), not a small bordered inset `<figure>`.
2. The hero shows heading **"Australian Certified Organic Tea"** + subheading **"Premium Organic Loose Leaf Tea Australia"** + the intro paragraph.
3. An **ACO certification badge** is present in the hero.
4. The wholesale eyebrow and the two prominent wholesale CTAs are **removed** from this hero; at most one demoted secondary wholesale link remains (pending owner confirmation).
5. The long SEO content remains reachable via the existing **read-more disclosure** (CMS-driven), not hardcoded in a component.
6. **Every other collection** (e.g. `/collections/all`, `tea-masters-selection…`) renders unchanged — the change is per-handle gated.
7. **No raw hex / inline styles** introduced; `cn()` used; warm/botanical tokens only; `pnpm lint` + `pnpm build` pass; Storybook builds (and a story exists if the hero is promoted to `src/components/`).

## Verification commands

- `pnpm lint`, `pnpm build`, `pnpm storybook` (build), and a browser/screenshot check of the collection page vs production.
- Grep guard: no new raw hex (`#[0-9a-fA-F]{3,6}`) in changed `className`s; no `style={{` in changed files.
  </specifics>

<deferred>
## Deferred / Follow-up Ideas
- Optionally relax `normalizeHtml()` to preserve `<h3>/<h4>/<ul>` structure inside the read-more so the SEO content reads richer (mapped to tokens) — separate from hero parity.
- Generalize the consumer-hero treatment to additional collections once this one is validated (config-driven, low marginal cost).
- A formal `/gsd-ui-phase` UI-SPEC.md could be generated if a stricter visual contract / UI-checker pass is desired; the UI contract is captured inline here for the lean standalone path.
</deferred>

---

_Phase: 07-collection-hero-production-parity_
_Context gathered: 2026-06-03 via /gsd-explore (standalone planning path)_
