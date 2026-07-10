# Phase 25: Heading structure fixes — Pattern Map

## Sanitized HTML boundary

- `src/lib/shopify/html-content.ts` is the sole trusted Shopify HTML boundary. It owns the variant union, allowlists, safe link/image handling, typography classes, heading transforms, table-region spacing, and the branded `SanitizedHtml` result.
- Reuse compact's allowlist and table policy for a new collection-only `collectionStory` variant; never add an application-level cast or alternate unsafe HTML boundary.
- A tag-only heading map is insufficient. The collection variant needs a source-aware transform that pairs each source heading with its output tag and class: `h3` → `h2` using compact `h3` visual styling, and `h4` → `h3` using compact `h4` visual styling. Existing compact behavior must not change.

## Product disclosure pattern

- `src/app/(storefront)/products/[handle]/page.tsx` already server-renders `specDisclosures` with `details`, `summary`, `open={index === 0}`, title text, and a decorative `ChevronDown`.
- Keep the summary flex, cursor, focus, list-reset layout and chevron `shrink-0`; put the title in a shrink/wrap-safe `h2` inside the existing summary. Do not add client state, roles, or `aria-expanded`.

## Collection story path

- Current flow is `collection.descriptionHtml` → normalize HTML → `sanitizeShopifyCompactHtml` → `StoryDisclosure` → `RichText variant="disclosure"`.
- Change only the sanitizer import/call for this non-rich-hero story path. Keep its placement after `ProductList` / `#product-grid`, and preserve `parseCollectionRichHero` / `CollectionRichHero` unchanged.
- `StoryDisclosure` already has native disclosure, focus, mobile wrapping, and chevron behavior. It needs no production change; only its fixture should represent sanitized `h2`/`h3` story content.

## Test conventions

- Sanitizer tests use direct substring expectations with `server-only` mocked.
- Product and collection route tests use `renderToStaticMarkup`, mocked framework integrations, markup/regex assertions, and `indexOf` ordering checks.
- Keep focused regression coverage for the compact product-description contract as well as new semantic assertions for collection story output.

## Expected file set

1. `src/lib/shopify/html-content.ts`
2. `src/lib/shopify/html-content.test.ts`
3. `src/app/(storefront)/products/[handle]/page.tsx`
4. `src/app/(storefront)/products/[handle]/page.test.tsx`
5. `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`
6. `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`
7. `src/components/collection/story-disclosure/story-disclosure.stories.tsx`

## Validation

```bash
pnpm vitest run src/lib/shopify/html-content.test.ts "src/app/(storefront)/products/[handle]/page.test.tsx" "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"
pnpm test:unit
pnpm typecheck
pnpm lint
```
