# Cart and Checkout Refinement Rationale

Date: 2026-06-04

This note documents the reasoning behind the review-driven refinements to the cart, checkout handoff, product quantity, Storybook, and test infrastructure work.

The requested review started from the staged diff, but no files were staged at the time. The refinement pass therefore reviewed the current working tree implementation and focused on production readiness for the revenue-critical cart path.

## Review Priorities

- Keep Shopify as the source of truth for cart, inventory, and checkout behavior.
- Keep the Next.js storefront responsible only for product selection, cart mutation, cart rendering, and checkout URL handoff.
- Avoid a client-side cart store. Cart identity remains server-owned through the `teavision_cart` cookie and Server Actions.
- Make quantity behavior consistent across PDP, collection quick-add, quick view, and cart line updates.
- Add useful automated coverage without pretending local tests can prove Shopify-hosted payment, tax, shipping, or order creation.
- Keep component extraction small and practical: extract only boundaries that improve testing, reuse, accessibility, or readability.

## Refinement Decisions

### Shared Quantity Rules

Shopify variant quantity rules are domain logic, not presentation logic. They affect multiple entry points: PDP add-to-cart, collection quick-add, product quick view, and cart line updates.

The review found that leaving min, max, and increment handling inside individual components would create drift and make MOQ or bulk-increment regressions likely. The shared helper keeps the policy in one place, gives tests a pure target, and lets UI components stay focused on rendering and user interaction.

### Cart Query Quantity Metadata

Cart lines now carry `currentlyNotInStock` and `quantityRule` data from Shopify because the cart is the last chance to prevent users from submitting invalid quantities before checkout handoff.

This keeps cart controls aligned with Shopify's current rules rather than relying on stale product-page assumptions. It also lets Storybook and unit tests document low-stock, out-of-stock, MOQ, max, and increment behavior.

### Collection Quick-Add Fallback

Collection product data only includes a limited variant edge set. Quick-add is safe only when the visible data proves the selected variant can be added correctly.

When a product may have more variants than the collection query fetched, the product card falls back to "View options" instead of pretending all variants are available. This is intentionally conservative: it protects customers from choosing incomplete variant data and avoids hidden inventory or quantity-rule mistakes.

### Explicit Pending State For Add To Cart

The shared `useAddToCart` hook now uses explicit pending state instead of relying only on React transition state.

The reason is failure recovery. Add-to-cart controls must disable while the action is in flight, but they must re-enable after a rejected action. An explicit state model keeps the permanent-pending Storybook scenario available while making real failures recoverable.

### Route-Local Cart View Extraction

`CartView` is extracted as a route-local component because it is a meaningful test and Storybook boundary: it renders a complete cart from a `Cart | null` input while the route wrapper keeps async data loading and Server Action wiring.

The extraction stays under `src/app/(storefront)/cart/_components/` rather than moving into `src/components/` because it is not a broadly reusable design-system component. This keeps the file structure lean while still making the UI testable.

### Test-Only Shopify Endpoint Guard

The fake Shopify endpoint override is intentionally guarded so it cannot replace production Storefront credentials by accident.

The override exists because browser interception cannot catch server-side Storefront GraphQL calls made by Server Components and Server Actions. Local tests need a real HTTP endpoint, but production and preview environments must continue to fail fast when Shopify credentials are missing or invalid.

### Fake Shopify E2E Boundary

The Playwright test uses a stateful fake Shopify server and stops at the fake `checkoutUrl`.

That boundary is deliberate. Local E2E can prove cart creation, add, update, remove, cookie persistence, UI refresh, and handoff link rendering. It cannot prove hosted Shopify checkout, payment, tax, shipping, order creation, or success redirects. Those remain in the hosted UAT checklist and are blocked until the Shopify dev store is approved for checkout testing.

### Scoped Storybook Interaction Gate

The Storybook test script is scoped to the affected cart, product, and quantity stories.

This makes the new interaction coverage useful and repeatable without claiming unrelated legacy stories are part of the Phase 10 gate. The stories cover default, disabled, loading, error, quantity-rule, empty-cart, populated-cart, and checkout-handoff states where relevant.

### Accessible Cart Controls

Cart update and remove controls now expose product-specific accessible names and use stable button/form structure.

The reason is keyboard and screen-reader clarity. A cart often contains repeated controls with identical visible labels, so accessible names need product context. The implementation keeps Server Action forms in place while preserving clear, reachable controls for assistive technology.

## Tradeoffs Accepted

- The cart view remains route-local instead of being promoted to a shared component because reuse is not yet real.
- Local tests validate checkout handoff only; hosted checkout remains a manual dev-store UAT responsibility.
- The fake Shopify server is a test support tool, not a full Shopify simulator. It should cover behavior the storefront owns and fail loudly for unhandled operations.
- Storybook interaction tests are scoped to changed stories. Broader Storybook cleanup should be handled separately if unrelated stories fail or drift.
- Cart pagination still fetches `lines(first: 100)`. Pagination or warning UI is a product decision outside this refinement pass.

## Verification Evidence

The review refinements were checked with:

- `corepack pnpm codegen`
- `corepack pnpm typecheck`
- `corepack pnpm test:unit`
- `corepack pnpm test:integration`
- `corepack pnpm test:e2e`
- `corepack pnpm test:stories`
- `corepack pnpm lint`
- `corepack pnpm build`
- `git diff --check`

See `docs/testing/cart-checkout-uat.md` for the hosted Shopify checkout checklist and `.planning/codebase/TESTING.md` for the project testing map.
