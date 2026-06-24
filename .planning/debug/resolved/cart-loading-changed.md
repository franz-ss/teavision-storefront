---
status: resolved
trigger: "Cart loading changed recently; it used to show the working skeleton loader."
created: "2026-06-24T13:49:34+08:00"
updated: "2026-06-24T13:53:43+08:00"
---

# Debug Session: Cart Loading Changed

## Symptoms

- expected_behavior: The cart route should show the existing skeleton loader while the cart page is loading.
- actual_behavior: The cart loading behavior changed recently and no longer appears to use that skeleton.
- error_messages: Unknown; no error message reported.
- timeline: Started recently.
- reproduction: Trigger a loading state for `/cart`.

## Current Focus

- hypothesis: Unknown.
- test: Inspect route files, recent git history, and the Next.js loading behavior for the cart segment.
- expecting: Identify the exact change that altered which loading UI is rendered.
- next_action: Resolved; restore full cart-layout skeleton and keep regression test coverage.
- reasoning_checkpoint:
- tdd_checkpoint: "RED: focused unit test failed because compact shell lacked 'Loading cart'; GREEN: same focused unit test passed after restoring skeleton."

## Evidence

- timestamp: "2026-06-24T13:53:00+08:00"
  observation: "No current src/app/(storefront)/cart/loading.tsx exists; cart loading is provided by an inline Suspense fallback in cart/page.tsx."
- timestamp: "2026-06-24T13:55:00+08:00"
  observation: "Commit c6ce66c0 changed CartLoadingSkeleton from a full cart-layout skeleton to a compact 'Checking your cart' status shell while preserving the page Suspense boundary."
- timestamp: "2026-06-24T13:55:00+08:00"
  observation: "Commit f7e51195 updated loading-skeleton.test.tsx to expect the compact shell and explicitly reject the old cart-grid markers."
- timestamp: "2026-06-24T13:51:52+08:00"
  observation: "Regression test restored to the filled-cart expectation and failed against current compact markup with missing 'Loading cart'."
- timestamp: "2026-06-24T13:52:35+08:00"
  observation: "After restoring CartLoadingSkeleton markup, the focused loading-skeleton unit test passed."

## Eliminated

## Resolution

- root_cause: "The recent perf change c6ce66c0 intentionally replaced the filled cart-layout skeleton markup with a compact empty-cart-style shell; f7e51195 then locked that new behavior into the test."
- fix: "Restored the full cart-layout skeleton markup while leaving the cart page's recent async/session optimization intact; restored the test assertions for the filled skeleton contract."
- verification: "pnpm test:unit -- 'src/app/(storefront)/cart/_components/loading-skeleton.test.tsx'; pnpm test:unit -- 'src/app/(storefront)/cart/_components/loading-skeleton.test.tsx' 'src/app/(storefront)/cart/_components/view.test.tsx' 'src/app/(storefront)/cart/_components/recommendations.test.tsx'; pnpm lint"
- files_changed: "src/app/(storefront)/cart/_components/loading-skeleton.tsx; src/app/(storefront)/cart/_components/loading-skeleton.test.tsx"
