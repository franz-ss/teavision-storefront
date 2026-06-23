---
phase: 17-operations-performance-and-final-production-readiness-audit
reviewed: 2026-06-23T23:47:11Z
depth: standard
files_reviewed: 55
files_reviewed_list:
  - '.env.example'
  - 'docs/launch/final-production-readiness-report.md'
  - 'docs/launch/operations-runbook.md'
  - 'docs/launch/performance-evidence.md'
  - 'docs/launch/production-e2e-evidence.md'
  - 'docs/launch/seo-route-evidence.md'
  - 'docs/testing/cart-checkout-uat.md'
  - 'docs/testing/customer-accounts-setup.md'
  - 'instrumentation-client.ts'
  - 'next.config.ts'
  - 'package.json'
  - 'playwright.production.config.ts'
  - 'pnpm-workspace.yaml'
  - 'scripts/component-contracts/noindex-mode.test.mjs'
  - 'scripts/launch/probe-readiness.mjs'
  - 'scripts/launch/probe-readiness.test.mjs'
  - 'scripts/launch/run-final-readiness-audit.mjs'
  - 'scripts/launch/run-final-readiness-audit.test.mjs'
  - 'scripts/performance/probe-lighthouse.mjs'
  - 'scripts/performance/probe-lighthouse.test.mjs'
  - 'sentry.edge.config.ts'
  - 'sentry.server.config.ts'
  - 'src/app/(storefront)/account/layout.tsx'
  - 'src/app/(storefront)/account/loading.tsx'
  - 'src/app/(storefront)/account/login/page.tsx'
  - 'src/app/(storefront)/account/page.tsx'
  - 'src/app/(storefront)/cart/checkout/route.ts'
  - 'src/app/api/health/route.test.ts'
  - 'src/app/api/health/route.ts'
  - 'src/app/api/webhooks/sanity/route.ts'
  - 'src/app/api/webhooks/shopify/route.ts'
  - 'src/components/product/product-gallery/product-gallery.tsx'
  - 'src/instrumentation.ts'
  - 'src/lib/cart/actions.ts'
  - 'src/lib/contact/actions.ts'
  - 'src/lib/observability/logger.test.ts'
  - 'src/lib/observability/logger.ts'
  - 'src/lib/observability/redact.ts'
  - 'src/lib/readiness/status.test.ts'
  - 'src/lib/readiness/status.ts'
  - 'src/lib/reviews/trustoo.ts'
  - 'src/lib/searchanise/search.ts'
  - 'src/lib/shopify/client.test.ts'
  - 'src/lib/shopify/client.ts'
  - 'src/lib/shopify/customer-account/client.ts'
  - 'src/lib/shopify/customer-account/env.test.ts'
  - 'src/lib/shopify/customer-account/env.ts'
  - 'src/lib/shopify/customer-account/oauth.ts'
  - 'src/lib/shopify/env.ts'
  - 'src/lib/shopify/operations/product.ts'
  - 'tests/e2e/cart-checkout.spec.ts'
  - 'tests/e2e/production-smoke.spec.ts'
  - 'tests/mocks/run-customer-account-api-server.ts'
  - 'tests/mocks/run-next-production-server.mjs'
  - 'tests/mocks/shopify-graphql-server.ts'
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 17: Code Review Report

**Reviewed:** 2026-06-23T23:47:11Z
**Depth:** standard
**Files Reviewed:** 55
**Status:** issues_found

## Summary

Reviewed the requested Phase 17 source, config, test, and launch evidence files at standard depth. `pnpm-lock.yaml` was excluded as a lockfile per review filtering. The readiness report continues to show `94/100` and `Not launch-ready` with the strict local performance failure visible; the issues below are tooling robustness and configuration defects in the submitted Phase 17 surface.

## Warnings

### WR-01: [WARNING] Non-Windows readiness lifecycle shutdown races the next server start

**File:** `scripts/performance/probe-lighthouse.mjs:277`
**Issue:** `stopProductionLifecycle()` awaits `stopChild()`, but the non-Windows path only sends `SIGTERM` and returns immediately. `run-final-readiness-audit.mjs` switches the owned production lifecycle from noindex to indexable mode on the same app and fake-provider ports, so the next lifecycle can start before the old `next start`, fake Shopify, or fake Customer Account process has actually released its port. That makes the final readiness audit flaky and can produce `EADDRINUSE` failures or probes against a stale server.
**Fix:**
```js
async function waitForChildExit(child) {
  if (child.exitCode !== null || child.signalCode !== null) return

  await new Promise((resolve) => {
    child.once('exit', resolve)
    child.once('error', resolve)
  })
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return

  if (process.platform === 'win32') {
    // existing taskkill /T /F branch
    return
  }

  child.kill('SIGTERM')
  await Promise.race([
    waitForChildExit(child),
    new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL')
      }
    }),
  ])
}
```

### WR-02: [WARNING] Production e2e server wrapper can leave `next start` orphaned

**File:** `tests/mocks/run-next-production-server.mjs:61`
**Issue:** The wrapper starts `corepack pnpm exec next start` through a shell, then `stop()` only calls `activeChild.kill()`. On platforms where that kills only the shell/Corepack wrapper, the actual Next server can remain alive after Playwright stops the web server. A later production smoke or performance run can then bind to, probe, or fail against a leftover server instead of the freshly built app.
**Fix:** Kill the spawned process tree and wait for exit, matching the stronger cleanup used by the performance lifecycle on Windows and adding process-group cleanup on POSIX.
```js
function stop() {
  if (!activeChild) return

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(activeChild.pid), '/T', '/F'], {
      stdio: 'ignore',
    })
    return
  }

  process.kill(-activeChild.pid, 'SIGTERM')
}
```
When using negative PIDs, spawn the child with `detached: true` on non-Windows and keep the existing exit/error handlers so the wrapper does not return until the child is gone.

### WR-03: [WARNING] Hardcoded ngrok dev origin creates a stale mutable trust boundary

**File:** `next.config.ts:8`
**Issue:** `allowedDevOrigins` trusts a specific public ngrok hostname checked into source. Ngrok hostnames are operationally mutable and can change or be reassigned outside this repository, so local dev server origin trust can become stale or point at a tunnel no longer controlled by the project. It also makes local OAuth setup brittle for any developer using a different approved tunnel.
**Fix:** Move the dev origin to an explicit local environment variable and omit the setting when it is not configured.
```ts
const allowedDevOrigin = process.env.NEXT_ALLOWED_DEV_ORIGIN?.trim()

const nextConfig: NextConfig = {
  ...(allowedDevOrigin ? { allowedDevOrigins: [allowedDevOrigin] } : {}),
  cacheComponents: true,
  // ...
}
```
Document `NEXT_ALLOWED_DEV_ORIGIN` in `.env.example` as local-only tunnel configuration.

---

_Reviewed: 2026-06-23T23:47:11Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
