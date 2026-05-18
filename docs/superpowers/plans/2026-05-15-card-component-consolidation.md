# Card Component Consolidation Plan

> **For agentic workers:** implement only after approval. Use this plan task-by-task, keep the shared primitive lean, and do not migrate every bordered thing just because it has a border.

**Goal:** Introduce a shared `Card` UI primitive for recurring card-like surfaces, then migrate the clearest repeated patterns so visual decisions live in one place instead of being copied through page code.

**Architecture:** Add `src/components/ui/card/` as a presentational primitive with Storybook coverage and a barrel export. The component should standardize the structural shell only: background tone, border, radius, optional padding, optional overflow clipping, and optional interactive border/focus behavior. Product-specific, article-specific, form-specific, and media layout decisions stay in their owning components.

**Design constraints:** Tailwind 4 utilities only, `cn()` for composition, existing tokens only, no raw color values, no new CSS modules, no default exports, no `any`, no client directive. Follow the current flat Teavision material language: warm/botanical tokens, 1px borders, `rounded-lg` or `rounded-md`, and very limited shadow usage.

---

## Existing Card-Like Patterns

| Pattern | Current locations | Current styling | Plan |
|---|---|---|---|
| Product card shell | `src/components/ui/product-card/product-card.tsx`, duplicated collection card shell in `src/app/(storefront)/collections/page.tsx` | `border-default bg-surface ... rounded-lg border overflow-hidden transition-colors` | Use `Card` with `interactive` and `overflow="hidden"`; keep image/body layout local. Consider extracting the collection card later if it keeps growing. |
| Article card shell | `src/components/ui/article-card/article-card.tsx` | `border-default bg-surface ... rounded-lg border overflow-hidden transition-colors` | Use `Card as="article"` with `interactive` and `overflow="hidden"`. |
| Repeated feature cards | `src/app/(storefront)/pages/custom-tea-blends/quality-section.tsx`, `process-section.tsx`, `blend-details-section.tsx`, `src/components/homepage/certification-coverage/certification-coverage.tsx` | Mostly `border-default bg-surface rounded-lg border p-5`; certification uses `bg-surface-sunken rounded-md` | Use `Card as="article" | "li"` with `padding="md"`; allow `tone="sunken"` for certification cards. |
| Form and support panels | `src/components/homepage/contact/contact.tsx`, `src/app/(storefront)/pages/custom-tea-blends/cta-section.tsx`, `src/app/(storefront)/pages/[...slug]/static-page-content.tsx`, `src/app/(storefront)/pages/contact/page.tsx` | `border-default bg-surface rounded-lg/md border p-5 sm:p-6`; contact page form uses `Section.Root` plus card styling | Use `Card` for simple wrappers around forms/support copy. Keep `Section.Root` for page bands only. |
| Empty states and simple message panels | `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/(storefront)/collections/[handle]/page.tsx`, `src/app/(storefront)/blogs/[blog]/blog-listing.tsx` | `bg-surface ... rounded p-10`, `border-default bg-surface rounded-lg border px-6 py-12/16` | Use `Card` where the element is a contained message surface. Migrate button styling separately only if already touching those files. |
| Blog article adjacent/comment/excerpt panels | `src/app/(storefront)/blogs/[blog]/[article]/page.tsx` | `border-default bg-surface rounded-lg border p-4/p-5`, optional hover border | Use `Card` for previous/next links and comments. Leave rich text blockquote class strings as-is because they target generated HTML. |
| Wholesale stat/path blocks | `src/app/(storefront)/pages/wholesale/page.tsx` | `dl` shell with `border-default bg-surface ... rounded-lg border`; path links as rounded bordered cards | Use `Card` for path links. Treat the stat `dl` as a specialized stat grid; migrate only if `Card` does not complicate its internal `gap-px` layout. |
| Mega menu popovers | `src/components/layout/header/header-mega-nav.tsx` | `border-subtle bg-surface-raised rounded-lg border shadow-xl` | Do not migrate in first pass. This is a popover/dropdown surface, not a content card, and it currently uses non-card elevation. |
| Form controls, chips, icons, images | inputs, tags, pagination, social buttons, product thumbnails, fieldsets | Rounded/bordered but function as controls or media frames | Do not consolidate into `Card`; these should remain with their control/media primitives. |
| Newsletter signup state panels | `src/components/ui/newsletter-signup/newsletter-signup.tsx` | `rounded-lg border p-6`, tone-dependent brand/success styling | Do not migrate initially. It is already a UI component with tone-specific success/error states, and forcing `Card` into it may blur responsibilities. |

---

## Proposed `Card` Primitive

Create:

| File | Purpose |
|---|---|
| `src/components/ui/card/card.tsx` | `Card` primitive and types |
| `src/components/ui/card/card.stories.tsx` | Storybook coverage for supported cases |
| `src/components/ui/card/index.ts` | Barrel export |
| `src/components/ui/index.ts` | Add `export * from './card'` |

Suggested API:

```tsx
<Card>...</Card>
<Card as="article" padding="md">...</Card>
<Card as="a" href="/..." interactive padding="md">...</Card>
<Card tone="sunken" padding="md">...</Card>
<Card overflow="hidden">...</Card>
```

Keep the implementation small:

| Prop | Values | Why |
|---|---|---|
| `as` | `div`, `article`, `aside`, `section`, `li`, `a` | Covers current semantic wrappers without adding a broad polymorphic abstraction. |
| `tone` | `surface`, `sunken` | Matches observed reusable surfaces. Brand/success/danger panels stay specialized. |
| `padding` | `none`, `sm`, `md`, `lg` | Current cards use no padding for media cards, `p-4`, `p-5`, and `p-5 sm:p-6`/`p-6`. |
| `radius` | `md`, `lg` | Current content cards use both; default should be `lg` because most reusable card shells do. |
| `overflow` | `visible`, `hidden` | Needed for media cards without making media a Card concern. |
| `interactive` | boolean | Adds `hover:border-brand`, focus ring, and transition for clickable card shells. |

Base styling should be token-only:

```ts
'border border-default bg-surface text-default rounded-lg'
```

Interactive styling should be token-only:

```ts
'transition-colors hover:border-brand focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
```

No initial `shadow` variant. The design docs conflict slightly with current implementation: `DESIGN.md` allows existing shadow utilities sparingly, while `DESIGN.json` says flat surfaces and no card shadows. Because most card-like patterns are border/tonal surfaces, the first pass should remove the need for card shadows rather than enshrine them as a variant. Existing `shadow-1`/`shadow-2` usages should be reviewed during migration and either dropped or left temporarily with a clear note.

---

## What Should Be Consolidated

Migrate first:

| Area | Files |
|---|---|
| Core reusable cards | `src/components/ui/product-card/product-card.tsx`, `src/components/ui/article-card/article-card.tsx` |
| Homepage/content cards | `src/components/homepage/contact/contact.tsx`, `src/components/homepage/testimonials/testimonials.tsx`, `src/components/homepage/certification-coverage/certification-coverage.tsx` |
| Custom tea blends repeated cards | `src/app/(storefront)/pages/custom-tea-blends/quality-section.tsx`, `process-section.tsx`, `blend-details-section.tsx`, `cta-section.tsx` |
| Page support/message cards | `src/app/(storefront)/pages/[...slug]/static-page-content.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx` |
| Blog local cards | `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`, `src/app/(storefront)/blogs/[blog]/blog-listing.tsx` |
| Wholesale path cards | `src/app/(storefront)/pages/wholesale/page.tsx` path links |

Defer or skip:

| Area | Reason |
|---|---|
| Header mega menu popovers | Popover surface, not a Card. It needs a future `Popover`/menu surface decision. |
| Rich text blockquote/table/image selectors | Generated HTML styling is better centralized in `RichText`, not in `Card`. |
| Inputs, chips, pagination buttons, social icon buttons | These are controls; card styling would make the primitive too broad. |
| NewsletterSignup | Already a UI component with tone/status state. Revisit after base Card migration. |
| Cart summary | Page currently uses older styling conventions; migrate only after cart page has a broader cleanup, so Card does not hide unrelated design drift. |

---

## How To Avoid Overengineering

- Do not add `CardHeader`, `CardBody`, `CardFooter`, media slots, title props, or compound subcomponents in the first pass.
- Do not create a variant for every current class string. If a case needs one-off layout, pass `className`.
- Do not include shadows until there is a confirmed design-system rule for card elevation in code.
- Do not make `Card` responsible for links, images, headings, icons, badges, or spacing between inner content.
- Do not replace semantic domain components like `ProductCard` or `ArticleCard`; make those components consume `Card`.
- Keep the prop list short enough that a developer can understand it from the Storybook controls.

---

## Expected Impact

- Shared card shells become visually consistent across product, article, feature, support, and empty-state surfaces.
- Future page work can use one primitive instead of retyping `border-default bg-surface rounded-lg border p-5`.
- `ProductCard` and `ArticleCard` remain the public product/article primitives; their callers should not change.
- Some existing pages will lose accidental inconsistency around `rounded` vs `rounded-md` vs `rounded-lg`, and `p-5` vs `p-6`.
- Shadowed homepage panels need a design decision. First-pass recommendation: remove card shadows from `Contact` and `Testimonials` when migrating; keep media-only `OrganicHerbs` out of the migration.

---

## Safe Migration Plan

### Task 1: Confirm Design Surface Rules

Files:
- Read: `DESIGN.md`
- Read: `docs/design-system/03-components.md`
- Read: `src/app/globals.css`

- [ ] Confirm the default card recipe: `border border-default bg-surface text-default rounded-lg`.
- [ ] Confirm whether `shadow-1` is allowed for resting cards in app code. If not explicitly approved, omit shadow from `Card`.
- [ ] Confirm `radius="md"` is only for denser compact surfaces and `radius="lg"` remains default.

### Task 2: Scaffold `Card`

Files:
- Create: `src/components/ui/card/card.tsx`
- Create: `src/components/ui/card/card.stories.tsx`
- Create: `src/components/ui/card/index.ts`
- Modify: `src/components/ui/index.ts`

- [ ] Run `pnpm create:component -- ui/card`.
- [ ] Implement `Card` as a server-safe presentational primitive.
- [ ] Use `cva` plus `cn()`, matching existing `Button`/`Section` patterns.
- [ ] Support only the approved props: `as`, `tone`, `padding`, `radius`, `overflow`, `interactive`.
- [ ] Add Storybook stories: default, compact, sunken, media/overflow, interactive link.

### Task 3: Migrate Reusable Card Components

Files:
- Modify: `src/components/ui/product-card/product-card.tsx`
- Modify: `src/components/ui/article-card/article-card.tsx`

- [ ] Replace duplicated shell classes with `Card`.
- [ ] Preserve public props and rendered layout.
- [ ] Preserve focus-visible behavior for clickable cards.
- [ ] Keep image/body spacing local.

### Task 4: Migrate Repeated Feature/Content Cards

Files:
- Modify: `src/components/homepage/certification-coverage/certification-coverage.tsx`
- Modify: `src/components/homepage/contact/contact.tsx`
- Modify: `src/components/homepage/testimonials/testimonials.tsx`
- Modify: `src/app/(storefront)/pages/custom-tea-blends/quality-section.tsx`
- Modify: `src/app/(storefront)/pages/custom-tea-blends/process-section.tsx`
- Modify: `src/app/(storefront)/pages/custom-tea-blends/blend-details-section.tsx`
- Modify: `src/app/(storefront)/pages/custom-tea-blends/cta-section.tsx`

- [ ] Use `Card` for repeated feature/list cards.
- [ ] Use `Card` for form/support panels.
- [ ] Do not migrate media-only image frames.
- [ ] Drop card shadows unless explicitly approved in Task 1.

### Task 5: Migrate Page-Level Local Cards

Files:
- Modify: `src/app/(storefront)/pages/[...slug]/static-page-content.tsx`
- Modify: `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`
- Modify: `src/app/(storefront)/blogs/[blog]/blog-listing.tsx`
- Modify: `src/app/(storefront)/pages/wholesale/page.tsx`
- Modify: `src/app/error.tsx`
- Modify: `src/app/not-found.tsx`

- [ ] Migrate support panels, empty states, previous/next article cards, comments, and wholesale path cards.
- [ ] Leave rich text selector styling untouched.
- [ ] Leave stat grid and popover-like surfaces untouched unless the migration is class-for-class simple.

### Task 6: Verify

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build` if Shopify credentials are available and build is expected to work locally.
- [ ] Run `pnpm build-storybook`.
- [ ] Spot-check Storybook for `Card`, `ProductCard`, and `ArticleCard`.
- [ ] Start `pnpm dev` and visually check key surfaces: homepage, collections, blog article, custom tea blends, contact, error/not-found where practical.

---

## Approval Questions

1. Should first-pass `Card` intentionally omit shadows and remove existing card shadows during migration?
2. Should `Card` support `as="a"` for clickable cards, or should links keep wrapping inner content while `Card` renders semantic `article`/`div` only?
3. Should empty states be migrated in the first pass, or should the first pass stay limited to repeated content cards?
