---
phase: 10
reviewers: [gemini, claude]
reviewed_at: 2026-06-04T08:13:25.7665887+08:00
plans_reviewed:
  - 10-01-PLAN.md
  - 10-02-PLAN.md
  - 10-03-PLAN.md
  - 10-04-PLAN.md
---

# Cross-AI Plan Review - Phase 10

## Reviewer Availability

Successful independent reviewers:

- Gemini CLI
- Claude CLI

Skipped:

- Codex CLI, because the current reviewer is Codex and the workflow asks for independent external reviewers.

Unavailable or failed:

- CodeRabbit, OpenCode, Qwen, Ollama, LM Studio, and llama.cpp were not available.
- Cursor was installed as an editor launcher, but did not expose the `cursor agent` interface required by the GSD review workflow.

## Gemini Review

# Cross-AI Plan Review: Phase 10 - Cart and Checkout Critical Flow Tests

## 1. Summary

This is an exceptionally well-structured and professional-grade testing strategy that addresses the "last mile" of production readiness for a headless commerce site. By introducing a stateful fake Shopify server and a guarded endpoint override, the plan elegantly solves the problem of testing server-side Shopify interactions and cookie lifecycles without hitting live APIs or relying on brittle mocks. The hierarchy, ranging from low-level unit tests to a manual UAT checklist for the hosted checkout, correctly identifies where the app's responsibility ends and Shopify's begins.

## 2. Strengths

- **Deterministic Infrastructure**: The "Fake Shopify" server (Plan 01) is the core strength, enabling high-fidelity E2E tests for sequence-dependent logic such as cart creation, add, and update.
- **Clean Seams**: Extracting `CartView` (Plan 03) is a textbook architectural improvement that allows fixture-driven UI testing of Server Component layouts without complex environment mocking.
- **Boundary Clarity**: The distinction between local responsibilities (handoff) and Shopify responsibilities (payment/tax) is clearly documented, preventing test bloat and false confidence in local mocks.
- **Revenue-Path Focus**: Prioritizing stale cookie recovery, inventory errors, and quantity edge cases (Plan 02) directly targets the highest-risk failure points identified in research.
- **Policy Alignment**: Explicitly updating `AGENTS.md` to document the testing exception maintains the integrity of the project's governance model.

## 3. Concerns

- **Environment Guard Complexity (MEDIUM)**: The guarded test-only Storefront GraphQL endpoint override (Plan 01, Task 2) carries a risk of accidental activation in production if the env-var naming or check logic is not sufficiently unique, such as checking only for presence rather than a specific `test` value.
- **Maintenance of Stateful Fake (LOW)**: As the Shopify schema or app requirements evolve, the `shopify-graphql-server.ts` mock will need to be maintained alongside the real API, creating a secondary source-of-truth risk.
- **Quantity Truncation Conflict (LOW)**: Research identified a conflict between `Math.trunc` and user-facing "whole number" expectations. While Plan 02 tests this, the plan does not explicitly state whether the code will be changed or whether the test will enforce current, potentially confusing, behavior.

## 4. Suggestions

- **Fake Server Observability**: Add a catch-all handler to the fake Shopify server that logs a clear error message when an unmocked GraphQL operation is attempted, making E2E debugging significantly faster.
- **Header Badge Race Conditions**: In Plan 04 (E2E), ensure the test specifically asserts that the header badge updates without a full page reload, verifying that `router.refresh()` and `useAddToCart` synchronization is functioning as intended.
- **Checkout URL Sanitization**: Add a specific unit test in Plan 02 for the checkout URL mapper to ensure it always produces an absolute `https://` URL, preventing potential redirection issues or relative path errors during handoff.
- **CI Resource Limits**: Given that Playwright tests against a production build can be resource-intensive, suggest adding a smoke-only flag for the E2E suite to allow faster runs during routine PR checks.

## 5. Risk Assessment: LOW

The overall risk is **LOW**. The plan is technically sound, respects existing architecture, and provides a clear path to resolving the manual-only QA debt currently present in the codebase. The use of typed fixtures and behavior-driven assertions minimizes the risk of brittle tests, and the phased rollout (infra, logic, UI, E2E) ensures a stable foundation at each step.

---

## Claude Review

## Phase 10 Plan Review: Cart and Checkout Critical Flow Tests

### Overall Assessment

The four-plan wave structure is sound and the strategy is well-grounded in the actual codebase. The Shopify boundary decisions, `CartView` extraction approach, and the UAT-vs-local split are all correct. However, there are two critical technical gaps, one in infrastructure setup and one in server-action testability, that will block execution if unresolved. Several medium concerns also need attention before these plans are handed to an executor.

## Plan 10-01: Infrastructure, Policy, and Fixtures

### Summary

The right foundation: update policy first, then add seams, then build fixtures. The approach is sound but the plan was written without knowing `@storybook/addon-vitest` is already installed, which creates a risky collision in the Vitest config setup.

### Strengths

- Policy-first ordering is correct. Updating `AGENTS.md` before adding tooling prevents ambiguity.
- Guarded fake endpoint override is the right approach; browser-level interception cannot intercept server-side Shopify calls.
- Smoke test makes Plan 01 independently verifiable before Plans 02/03 run.
- Fixture factories are correctly scoped to `@/lib/shopify/types`, not generated types.

### Concerns

- **HIGH**: `@storybook/addon-vitest` is already in `devDependencies`. Storybook 10 uses Vitest natively through this addon. A new standalone `vitest.config.mts` may conflict with or duplicate the Storybook-driven Vitest config. The plan must check whether the addon is already configured and whether the new config extends it via `mergeConfig` or runs as a separate workspace project. Getting this wrong means either story tests break or server tests do not resolve the right tsconfig paths.
- **HIGH**: When `SHOPIFY_STOREFRONT_GRAPHQL_URL` override is active, the existing guard `if (!domain || !token)` in `client.ts` still requires both production credentials. If the override is meant to replace the full URL, not just add to it, the credential check must be conditionally bypassed, but that must be guarded to prevent bypass in production. The plan does not specify this.
- **MEDIUM**: `tests/mocks/shopify-graphql-server.ts` is described as a stateful fake Storefront server but the plan does not specify whether this is an in-process mock or a real HTTP server on a port. Integration tests (Vitest Node) and E2E tests (Playwright) need different things: in-process mocking for Vitest, an actual HTTP endpoint for Playwright. One implementation may not serve both.
- **LOW**: `pnpm-lock.yaml` is listed in `files_modified`. It is generated automatically. Listing it is harmless noise, but an executor treating it as a manual edit target would be confused.

### Suggestions

- Explicitly check whether `@storybook/addon-vitest` is already wired in before creating a new config. If it is, use `vitest.workspace.ts` to run Storybook plays and standalone unit/integration tests as separate projects under one Vitest run.
- Define two separate fake Shopify surfaces: an in-process mock or handler for Vitest tests, and a lightweight HTTP handler, such as Node `http.createServer`, for Playwright's `webServer` setup.
- Specify the exact semantics of the endpoint override: if `SHOPIFY_STOREFRONT_TEST_URL` is set, skip credential validation and use that URL, and ensure the env var name cannot be set by `.env.production`.

## Plan 10-02: Server-Side Unit and Integration Tests

### Summary

Good coverage target list, but the most critical plan in the series has a critical unaddressed gap: `actions.ts` is deeply coupled to `next/headers` (cookies) and `next/cache` (`revalidatePath`), and the plan does not say how these Next.js server-only APIs will be handled in Vitest.

### Strengths

- Correct test-to-layer mapping: `client.test.ts` as unit, `actions.test.ts` as integration.
- `cache: 'no-store'` assertion is important and included.
- Stale cart recovery, quantity normalization edge cases, and `userErrors` paths are all called out.
- Quick-view 404/503 coverage is correctly scoped.

### Concerns

- **HIGH**: `actions.ts` calls `cookies()` from `next/headers` and `revalidatePath()` from `next/cache`. These are Next.js server-only APIs that throw if called outside a Next.js request context. Vitest has no Next.js runtime. The plan must specify one of: `vi.mock('next/headers', ...)` and `vi.mock('next/cache', ...)`, extracting the cookie read/write behavior into an injectable helper, or using Next.js experimental test utilities if available in Next 16. Without a solution here, Task 3 will not run.
- **HIGH**: "Extract pure helpers only if necessary" is not a sufficient specification for Task 3. Whether extraction is needed is a prerequisite judgment that should be made during planning, not during execution. The current `actions.ts` structure mixes cookies, Shopify calls, validation, error mapping, and revalidation in every action. The plan should commit to a mocking strategy or a targeted extraction so the executor is not blocked.
- **MEDIUM**: The plan uses two different scripts, `pnpm test:unit` for `client.test.ts` and `pnpm test:integration` for `actions.test.ts`, but Plan 10-01 does not clearly define what distinguishes them at the config level. If they are the same Vitest run, this is just labeling. If they are different environments (jsdom vs. node), the config must separate them, and each test file must land in the right environment via `@vitest-environment` pragma or config pattern matching.
- **MEDIUM**: Next.js route handler tests share the same problem: `NextRequest` and `NextResponse` from Next.js may not resolve correctly in Vitest without explicit mocking or Next experimental test utilities.

### Suggestions

- Add a Task 0 or setup note that establishes the Next.js mock strategy before Tasks 3 and 4 are written. At minimum: `vi.mock('next/headers', () => ({ cookies: vi.fn() }))` plus a helper that lets individual tests control the returned cookie store.
- Specify `// @vitest-environment node` at the top of `actions.test.ts`; server actions must run in Node, not jsdom.
- Consider a narrow extraction: testable `readCartCookie(cookieStore)` and `writeCartCookie(cookieStore, id)` helpers that `actions.ts` calls with the result of `await cookies()`. This keeps the action structure intact while making the cookie boundary injectable.

## Plan 10-03: Storybook Coverage

### Summary

Solid. The `CartView` extraction is the right call, and using existing injection points (`action`, `addToCart`, `onCartChanged`) is correct. The file placement concern is already handled because `main.ts` includes `src/app/**/_components/**/*.stories.@(js|jsx|mjs|ts|tsx)`.

### Strengths

- `CartView` extraction preserves async boundary correctly: `CartContent` fetches, `CartView` renders.
- Injection-based stories avoid global fetch mocks where possible.
- Coverage matrix is behavior-driven: roles, names, `href`, and `role="alert"`.
- `cart.checkoutUrl` fixture assertion is the right way to validate handoff rendering.

### Concerns

- **MEDIUM**: Stories in `cart-view.stories.tsx` will import from `tests/fixtures/shopify/cart.ts`. Vite/Storybook resolves paths through `tsconfig.json` path aliases, but `tests/` is a root-relative directory without an alias. The import from `src/app/(storefront)/cart/_components/` would be unusually long. Consider adding a `@/tests` path alias in `tsconfig.json` or colocating fixture exports in a package-accessible location.
- **MEDIUM**: The `CartView` extraction plan says "Keep data fetching in `CartContent`" but `CartContent` is the current top-level async function. It would become a thin wrapper that calls `getCartAction()` and passes the result to `CartView`. The naming should be explicit in the plan: the current `CartContent` becomes a one-liner, and `CartView` receives `cart: Cart | null`.
- **LOW**: Storybook build (`pnpm build-storybook`) is in the verification list, but the existing `test:stories` command also runs Storybook build. Running both in verification is redundant. Pick one.

### Suggestions

- Add a `@/tests` TypeScript path alias in `tsconfig.json` as part of Plan 10-01, so fixture imports from stories are clean.
- Be explicit in Task 1 that the extracted `CartView` has the signature `CartView({ cart }: { cart: Cart | null })` and that `CartContent` retains its name as the async data-loading wrapper.

## Plan 10-04: E2E and Documentation

### Summary

The scope is correct: thin deterministic E2E, no live Shopify, hosted checkout as UAT. But the operational plumbing for actually running Playwright is underspecified. Playwright against a production build requires knowing how to start the app and the fake server.

### Strengths

- Thin E2E scope (PDP add, badge refresh, cart update/remove, failure/retry, handoff URL) is the right call given integration coverage depth.
- UAT checklist correctly separates local test scope from hosted checkout scope.
- Blocking third-party hosts in Playwright prevents flaky tests from analytics/payment calls.
- `TESTING.md` update removes the manual-only status that would otherwise give false confidence.

### Concerns

- **HIGH**: Playwright tests against a production build require a running server. The `playwright.config.ts` must include a `webServer` config that either runs `pnpm build && pnpm start` or assumes a pre-built artifact. The fake Shopify server also needs to be started as part of this setup, either as a Playwright global setup file or as a second `webServer`. The plan lists both as files to modify but does not specify the startup/teardown mechanism.
- **MEDIUM**: If the fake Shopify server is stateful and E2E tests run in parallel (Playwright's default), shared state will cause test interference. Either the fake server needs per-test state isolation, keyed by a request header for example, or Playwright must be configured to run tests serially (`workers: 1` or `fullyParallel: false`).
- **MEDIUM**: `docs/testing/cart-checkout-uat.md` is a new documentation file. The user's CLAUDE.md says "NEVER create documentation files (\*.md) or README files unless explicitly requested." However, this plan was explicitly designed to create UAT documentation, so this is fine, but note the executor will see the CLAUDE.md prohibition and may halt. The plan should add a note that this file is an approved exception.
- **LOW**: The verification command list runs the full suite: `pnpm test:unit`, `pnpm test:integration`, `pnpm test:stories`, `pnpm test:e2e`, and `pnpm build`. This is five separate heavy operations. For a final integration step this is appropriate, but `pnpm build` will already have run as a prerequisite for `pnpm test:e2e` if Playwright's `webServer` triggers it.

### Suggestions

- Add an explicit Playwright `globalSetup` specification: start the fake Shopify server in `tests/setup/playwright-global-setup.ts`, expose its port, and set `SHOPIFY_STOREFRONT_TEST_URL` before Playwright boots the Next app.
- Add `workers: 1` or per-test state reset to the fake server spec to avoid parallel test interference, at least for the first pass.
- Add a note in the plan or in `playwright.config.ts` comments that `test:e2e` requires a prior `pnpm build` or that `webServer` handles it.

## Risk Assessment

| Plan  | Risk       | Primary Driver                                                                           |
| ----- | ---------- | ---------------------------------------------------------------------------------------- |
| 10-01 | **HIGH**   | `@storybook/addon-vitest` collision plus fake server ambiguity                           |
| 10-02 | **HIGH**   | `next/headers` and `next/cache` not runnable in Vitest without explicit mocking strategy |
| 10-03 | **MEDIUM** | Fixture import path; otherwise well-specified                                            |
| 10-04 | **HIGH**   | Playwright startup and fake server plumbing underspecified                               |

**Overall phase risk: HIGH** before these gaps are addressed; **MEDIUM** after.

The two blockers that must be resolved before execution begins:

1. Establish the Vitest configuration strategy relative to the existing `@storybook/addon-vitest` setup.
2. Define how `next/headers` and `next/cache` will be handled in Plan 10-02's server action tests: mocking strategy, environment pragma, or targeted extraction.

---

## Consensus Summary

Both successful reviewers agree that the Phase 10 testing strategy is directionally strong. The plan correctly treats Shopify as the source of truth, keeps hosted checkout validation out of local unit tests, prioritizes revenue-critical cart flows, and introduces the right major seams: deterministic Shopify fakes, typed fixtures, `CartView` extraction, Storybook interaction coverage, and thin Playwright coverage.

The main difference is risk posture. Gemini assessed the plan as low risk because the architecture and sequencing are sound. Claude assessed it as high risk before remediation because some execution mechanics are still underspecified. The consensus action should follow Claude's stricter blockers while preserving Gemini's endorsement of the overall shape.

### Agreed Strengths

- The unit/integration/Storybook/E2E/UAT hierarchy matches the headless Shopify boundary.
- A fake Shopify Storefront API is the right solution for server-side cart and Playwright tests.
- `CartView` extraction is the right way to test cart rendering without unit-testing an async Server Component directly.
- The plans focus on high-value business risks: stale cart cookies, cart persistence, quantity validation, inventory failures, discount display, and checkout handoff.
- The plans intentionally avoid false confidence around hosted Shopify checkout, tax, shipping, order creation, and payment processing.

### Agreed Concerns

- **HIGH**: Plan 10-01 must reconcile the existing Storybook/Vitest setup before adding standalone Vitest config and scripts.
- **HIGH**: Plan 10-02 must specify how Vitest will handle `next/headers`, `next/cache`, cookies, and revalidation in server-action tests.
- **HIGH**: The fake Shopify endpoint override needs exact, production-safe semantics, including how it interacts with existing Shopify domain/token validation.
- **HIGH**: Plan 10-04 must specify Playwright startup/teardown for both the Next app and fake Shopify server.
- **MEDIUM**: Stateful fake Shopify tests need isolation, especially if Playwright runs tests in parallel.
- **MEDIUM**: Fixture imports for Storybook need a clean path strategy.
- **LOW**: Quantity truncation should be decided explicitly: preserve current behavior as a contract, or change behavior and test the new contract.

### Divergent Views

- Gemini considers the overall plan low risk because the architecture is sound and the phase sequencing is strong.
- Claude considers the phase high risk until the test-runner configuration, server-action mocking, and Playwright fake-server lifecycle are specified.
- There is no disagreement on the strategic direction; the divergence is about readiness for execution.

### Recommended Planning Updates Before Execution

1. Update Plan 10-01 to inspect existing Storybook/Vitest dependencies and choose a concrete config model, preferably a Vitest workspace if Storybook's Vitest addon is active.
2. Update Plan 10-01 to define separate test environments for Node integration tests and jsdom component tests.
3. Update Plan 10-01 to define the test-only Shopify endpoint env var and guard semantics. Prefer a name such as `SHOPIFY_STOREFRONT_TEST_URL`, only honored when `NODE_ENV === 'test'` or an explicit test-mode flag is set.
4. Update Plan 10-01 to add fake Shopify observability: every unhandled GraphQL operation should fail with a clear operation-name error.
5. Update Plan 10-02 with an explicit `next/headers` and `next/cache` mocking strategy, or a small helper extraction for cookie read/write behavior.
6. Update Plan 10-02 to include `@vitest-environment node` or equivalent config for server-action and route-handler tests.
7. Update Plan 10-03 with the exact `CartView({ cart }: { cart: Cart | null })` boundary and fixture import strategy.
8. Update Plan 10-04 with Playwright `globalSetup` or `webServer` details for starting/stopping fake Shopify and the Next app.
9. Update Plan 10-04 to run Playwright serially at first, or provide per-test fake-server state reset.
10. Add an explicit approved exception note for any new UAT markdown documentation, since repo/project rules may otherwise discourage new docs.

To incorporate this feedback into planning:

```bash
$gsd-plan-phase 10 --reviews
```
