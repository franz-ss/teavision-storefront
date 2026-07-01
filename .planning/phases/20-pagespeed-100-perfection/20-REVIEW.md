---
phase: 20-pagespeed-100-perfection
reviewed: 2026-07-01T00:00:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - src/components/homepage/hero/hero.tsx
  - scripts/component-contracts/launch-image-performance.test.mjs
  - next.config.ts
  - instrumentation-client.ts
  - docs/launch/homepage-performance-fixes.md
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 20: Code Review Report

**Reviewed:** 2026-07-01T00:00:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Reviewed the four homepage PageSpeed fixes (hero `fetchPriority`, `next.config.ts`
AVIF/WebP format negotiation, lazy-loaded Sentry client SDK, and the updated
component-contract test) plus the accompanying decision doc.

The core technical claims hold up under verification against the actual Next.js
runtime source in this fork (`node_modules/next/dist/shared/lib/get-img-props.js`,
`node_modules/next/dist/client/image-component.js`): `preload` and `fetchPriority` are
independent, non-deprecated props in this Next.js version, `ImagePreload` does read
`fetchPriority` and forwards it into the emitted `<link rel="preload">` via
`ReactDOM.preload`, and the hero's `fill` `<Image>` is the only block the updated test
intentionally exempts from the "don't combine preload with fetchPriority" guard (via an
early `continue` scoped to `HERO_PATH`). `pnpm exec tsc --noEmit`, `pnpm exec eslint`
on the five files, and `node --test scripts/component-contracts/launch-image-performance.test.mjs`
were all re-run during this review and pass.

The one real defect found is a robustness gap in `instrumentation-client.ts`: the new
dynamic `import('@sentry/nextjs').then(...)` chain has no rejection handler, which
directly contradicts this Next.js fork's own documented guidance for this file
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md`:
*"Implement try-catch blocks around your instrumentation code to ensure robust
monitoring. This prevents individual tracking failures from affecting other
instrumentation features."*). Two lower-severity documentation/test-precision items are
also noted below.

## Warnings

### WR-01: Unhandled promise rejection if the dynamic Sentry import or `Sentry.init` fails

**File:** `instrumentation-client.ts:14-25`
**Issue:** The dynamic import chain has no `.catch()`:

```ts
if (clientDsn) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({ ... })
    captureRouterTransitionStart = Sentry.captureRouterTransitionStart
  })
}
```

If the chunk fails to load (network blip, ad-blocker/CSP interference, CDN hiccup on
the Next static asset host) or if `Sentry.init(...)` throws synchronously inside the
`.then()` callback, this produces an unhandled promise rejection in the browser. On
a page that has a `NEXT_PUBLIC_SENTRY_DSN` configured specifically to catch errors,
a failure in the error-monitoring bootstrap itself would go unreported and would
surface only as a generic "Unhandled Promise Rejection" in the console (or trigger
`window.onunhandledrejection` handlers elsewhere in the app, if any).

This isn't a style nitpick — the Next.js fork's own `instrumentation-client` doc
explicitly calls out this exact requirement: *"Implement try-catch blocks around your
instrumentation code to ensure robust monitoring. This prevents individual tracking
failures from affecting other instrumentation features."* The new code does not follow
that guidance for the code path it added.

**Fix:**
```ts
if (clientDsn) {
  import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.init({
        dsn: clientDsn,
        environment: process.env.SENTRY_ENVIRONMENT,
        release: process.env.SENTRY_RELEASE,
        sendDefaultPii: false,
        tracesSampleRate: 0,
        enableLogs: false,
      })
      captureRouterTransitionStart = Sentry.captureRouterTransitionStart
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to initialize Sentry client SDK', error)
      }
    })
}
```

## Info

### IN-01: `docs/launch/homepage-performance-fixes.md` "No-regressions statement" claims are unverified at doc-write time

**File:** `docs/launch/homepage-performance-fixes.md:96-104`
**Issue:** The doc asserts `pnpm lint`, `pnpm typecheck`, `pnpm build`, the
component-contract test suite, the crawlable-HTML probe, and the Playwright H1 guard
"were run after all code changes and passed," but the doc itself does not link to or
embed any command output/log evidence for the full list (only the component-contract
test and typecheck were independently re-verified in this review; `pnpm build`, the
crawlable-HTML probe, and the Playwright spec were not re-run here and their pass/fail
state as of doc-authoring time is asserted, not evidenced). This is a minor
documentation-rigor gap rather than a code defect — for a doc whose whole purpose is to
serve as the "no regressions" audit trail, an unlinked/unevidenced claim list reduces
its value as a checkpoint artifact.
**Fix:** Either link each claim to a CI run/log artifact, or soften the language to
distinguish "run locally by the author, not independently re-verified" from "verified
in this review," so future readers of this doc know which claims have durable
evidence.

### IN-02: Hero content's declared `width`/`height` on the LCP image asset are dead data for this render path

**File:** `src/components/homepage/hero/hero.tsx:27-35` (consumes `HOMEPAGE_HERO.image` from `src/components/homepage/content.ts:111-116`)
**Issue:** `HOMEPAGE_HERO.image` declares `width: 1440, height: 810`, but the hero
`<Image>` uses `fill` mode, which ignores `width`/`height` entirely (Next.js throws if
both `fill` and `width`/`height` are passed together — they aren't passed here, so no
runtime error, but the two numeric fields on the shared `ImageAsset` shape go unused by
this consumer). This predates this phase's diff and isn't a regression introduced by
these changes, but since this phase touched the same `<Image>` block, it's a good
low-risk opportunity to either use the intrinsic dimensions for a non-`fill` responsive
layout or to document why `fill` was chosen over a sized `<Image>` for this
specific LCP element (a sized/responsive `<Image>` with `preload`/`fetchPriority`
would still satisfy the PSI fix while giving the browser explicit intrinsic dimensions
without relying on `fill`+absolute positioning).
**Fix:** No action required for this phase's stated scope; flagged for awareness only.
If revisited, either drop the unused `width`/`height` from `HOMEPAGE_HERO.image` (if
`fill` is the long-term approach for this element) or switch away from `fill`.

---

_Reviewed: 2026-07-01T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
