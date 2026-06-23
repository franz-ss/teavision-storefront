---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 02
subsystem: operations
tags: [nextjs, sentry, observability, logging, redaction, vercel]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: safe public health endpoint, private readiness probe, and operations runbook foundation from 17-01
provides:
  - Sentry-style Next.js server, edge, client, and request-error instrumentation
  - Typed redaction and structured logging helpers for ecommerce observability events
  - Redacted checkout, account, provider, form, and webhook event logging
  - Launch watch signal routing with Sentry/Vercel source guidance and week-one checks
affects: [phase-17-final-audit, operations, observability, launch-readiness, ecommerce-privacy]

# Tech tracking
tech-stack:
  added: [@sentry/nextjs]
  patterns:
    - Env-gated Sentry setup with private DSN server-only and public DSN client-only
    - Provider-neutral `logEvent()` boundary with recursive ecommerce redaction
    - Revenue/provider logs carry status/count/hash metadata instead of PII, raw payloads, or checkout URLs

key-files:
  created:
    - src/instrumentation.ts
    - instrumentation-client.ts
    - sentry.server.config.ts
    - sentry.edge.config.ts
    - src/lib/observability/redact.ts
    - src/lib/observability/logger.ts
    - src/lib/observability/logger.test.ts
  modified:
    - package.json
    - pnpm-lock.yaml
    - pnpm-workspace.yaml
    - next.config.ts
    - src/app/(storefront)/cart/checkout/route.ts
    - src/lib/cart/actions.ts
    - src/lib/shopify/customer-account/client.ts
    - src/lib/shopify/customer-account/oauth.ts
    - src/lib/shopify/client.ts
    - src/lib/searchanise/search.ts
    - src/lib/reviews/trustoo.ts
    - src/lib/shopify/operations/product.ts
    - src/lib/contact/actions.ts
    - src/app/api/webhooks/shopify/route.ts
    - src/app/api/webhooks/sanity/route.ts
    - docs/launch/operations-runbook.md

key-decisions:
  - "Sentry source-map/release upload remains disabled unless SENTRY_AUTH_TOKEN and SENTRY_RELEASE are configured; runtime capture is DSN-gated."
  - "Structured observability contexts carry statuses, counts, reasons, and stable hashes rather than raw customer PII, checkout URLs, tokens, provider payloads, or submitted message bodies."
  - "Vercel runtime logs are acceptable for launch-day triage, while longer retention or routing should use Sentry, Vercel Log Drains, or another approved provider."

patterns-established:
  - "Use `logEvent(level, eventName, context)` for revenue/provider boundaries; event names are typed in `ObservabilityEventName`."
  - "Use `hashIdentifier()` for cart/product identifiers when correlation is needed without exposing the source identifier."
  - "Provider degradations log warnings; revenue-critical checkout/account/cart identity failures log errors."

requirements-completed: [OPS-02, OPS-03, OPS-04]

# Metrics
duration: 23 min
completed: 2026-06-23
---

# Phase 17 Plan 02: Launch Observability And Redacted Logging Summary

**Sentry-style Next instrumentation with typed redacted ecommerce logging across checkout, account, provider, form, and webhook boundaries**

## Performance

- **Duration:** 23 min
- **Started:** 2026-06-23T06:42:07Z
- **Completed:** 2026-06-23T07:05:31Z
- **Tasks:** 5
- **Files modified:** 27

## Accomplishments

- Added `@sentry/nextjs`, Sentry-wrapped Next config, runtime-specific config files, client instrumentation, and Next `onRequestError` forwarding guarded by env presence.
- Added recursive redaction for emails, phones, tokens, sensitive field keys, checkout URLs, cookies, provider bodies/payloads, and message/brief/notes fields, plus stable identifier hashing.
- Wired structured redacted events for checkout handoff, cart buyer identity sync, Customer Account API/OAuth, Shopify Storefront, Searchanise, Trustoo, HulkApps, contact/newsletter/NPD/wholesale providers, and Shopify/Sanity webhooks.
- Expanded the operations runbook with a concrete launch watch table, Sentry/Vercel runtime-log routing guidance, Log Drains retention guidance, and week-one monitoring checks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Install and configure Sentry-style Next instrumentation** - `cad9b322` (feat)
2. **Task 2: Add typed redaction and structured logging helpers** - `633ae5e4` (feat)
3. **Task 3: Wire revenue-critical checkout and account logging** - `7ba6c500` (feat)
4. **Task 4: Wire provider, form, and webhook logging** - `b1d94fdf` (feat)
5. **Task 5: Document launch watch and alert routing** - `c90c6eb9` (docs)

## Files Created/Modified

- `src/instrumentation.ts` - Next server/edge registration plus Sentry request-error forwarding when DSN env is configured.
- `instrumentation-client.ts` - Client Sentry initialization using only `NEXT_PUBLIC_SENTRY_DSN`.
- `sentry.server.config.ts` / `sentry.edge.config.ts` - Server and edge Sentry setup with conservative sampling and no default PII.
- `next.config.ts` - Existing Next config wrapped with Sentry build settings while preserving redirects, headers, images, Cache Components, and `poweredByHeader`.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` - Added `@sentry/nextjs` and explicit Sentry CLI build-script policy.
- `src/lib/observability/redact.ts` - Recursive redaction and stable hash helper.
- `src/lib/observability/logger.ts` - Typed event-name union and structured logger.
- `src/lib/observability/logger.test.ts` - Unit coverage for PII/token/checkout URL/message redaction and event acceptance.
- `src/app/(storefront)/cart/checkout/route.ts` and `src/lib/cart/actions.ts` - Checkout handoff and cart identity sync events using cart hashes only.
- `src/lib/shopify/customer-account/client.ts` and `src/lib/shopify/customer-account/oauth.ts` - Customer Account API and OAuth failure events without OAuth secrets or tokens.
- `src/lib/shopify/client.ts`, `src/lib/searchanise/search.ts`, `src/lib/reviews/trustoo.ts`, `src/lib/shopify/operations/product.ts`, `src/lib/contact/actions.ts` - Provider/form failures routed through redacted events.
- `src/app/api/webhooks/shopify/route.ts` and `src/app/api/webhooks/sanity/route.ts` - Webhook accepted/rejected events without raw bodies or signatures.
- `docs/launch/operations-runbook.md` - Launch watch, escalation, retention/routing, and week-one observability checks.

## Decisions Made

- Sentry source-map/release upload remains disabled unless `SENTRY_AUTH_TOKEN` and `SENTRY_RELEASE` are configured; this prevents local installs/builds from requiring Sentry auth while preserving production setup.
- Logs intentionally omit raw provider responses, GraphQL variables, request bodies, form values, OAuth material, checkout URLs, customer emails, and token values; correlation uses safe status metadata and hashes.
- Vercel runtime logs are documented as launch-day triage only; longer retention or routing belongs in Sentry, Vercel Log Drains, or another approved observability provider.

## Verification

- `pnpm typecheck` - passed
- `pnpm lint -- next.config.ts src/instrumentation.ts instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts` - passed
- `pnpm test:unit -- src/lib/observability/logger.test.ts` - passed
- `pnpm test:unit -- src/lib/observability/logger.test.ts src/lib/contact/actions.test.ts src/lib/shopify/client.test.ts "src/app/api/search/suggestions/route.test.ts"` - passed
- `pnpm test:integration -- "src/app/api/search/suggestions/route.test.ts"` - passed
- `pnpm test:unit -- src/lib/observability/logger.test.ts src/lib/cart/actions.test.ts "src/app/(storefront)/cart/checkout/route.test.ts" "src/lib/shopify/customer-account/actions.test.ts"` - passed
- `pnpm test:integration -- "src/app/(storefront)/cart/checkout/route.test.ts" "src/app/(storefront)/account/**/*.test.ts"` - passed
- `node scripts/launch/probe-readiness.mjs --mode docs` - passed
- Plan-level `pnpm test:unit -- src/lib/observability/logger.test.ts src/lib/contact/actions.test.ts src/lib/shopify/client.test.ts src/lib/cart/actions.test.ts` - passed; project script intentionally excludes `src/lib/cart/actions.test.ts`, which is covered by `test:integration`.
- Plan-level `pnpm test:integration -- "src/app/(storefront)/cart/checkout/route.test.ts" "src/app/(storefront)/account/**/*.test.ts" "src/app/api/search/suggestions/route.test.ts"` - passed
- Plan-level `pnpm lint -- src/lib/observability src/instrumentation.ts instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts next.config.ts` - passed
- Plan-level `pnpm typecheck` - passed
- Plan-level `node scripts/launch/probe-readiness.mjs --mode docs` - passed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Normalized Sentry CLI build-script policy**
- **Found during:** Task 1 (Install and configure Sentry-style Next instrumentation)
- **Issue:** `pnpm add @sentry/nextjs` installed the dependency but returned an ignored-builds gate for `@sentry/cli`, leaving `pnpm-workspace.yaml` with a generated placeholder value.
- **Fix:** Set `allowBuilds['@sentry/cli']` to `false` and configured Sentry source-map/release upload to remain disabled unless Sentry auth env is explicitly provided.
- **Files modified:** `pnpm-workspace.yaml`, `next.config.ts`
- **Verification:** `pnpm typecheck`; `pnpm lint -- next.config.ts src/instrumentation.ts instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts`; Task 1 commit hook
- **Committed in:** `cad9b322`

---

**Total deviations:** 1 auto-fixed (1 blocking issue)
**Impact on plan:** The package-manager fix keeps local installs deterministic and preserves the intended env-gated Sentry setup without adding source-map upload requirements.

## Issues Encountered

- `pnpm add @sentry/nextjs` returned `ERR_PNPM_IGNORED_BUILDS` after writing dependency changes. This was resolved by the documented Rule 3 fix above.
- PowerShell acceptance scans needed quoted route paths containing parentheses; reruns with literal/quoted paths passed.

## Known Stubs

None. The stub-pattern scan only found legitimate null checks, empty test arrays, default context objects, and a package-name placeholder inside `pnpm-lock.yaml`. Empty Sentry values in `.env.example` are intentional configuration placeholders and do not flow to UI rendering.

## Threat Flags

None. The new observability surfaces were covered by the plan threat model: runtime error capture, revenue/provider logging, and strict ecommerce redaction.

## User Setup Required

No `USER-SETUP.md` was generated. Production Sentry/Vercel routing still requires operator configuration of the documented env keys and provider dashboards before launch monitoring emits to external systems.

## Next Phase Readiness

Ready for `17-03`: performance and UX evidence can build on redacted launch observability, health/readiness docs mode, and the updated operations runbook.

## Self-Check: PASSED

- Created files exist in the worktree.
- Task commits exist in git history.
- Required verification commands passed.
- SUMMARY includes deviations, known-stub review, and threat-surface review.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-23*
