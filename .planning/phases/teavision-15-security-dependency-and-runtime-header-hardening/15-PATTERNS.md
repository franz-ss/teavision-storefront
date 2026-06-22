# Phase 15 Pattern Map

**Phase:** 15 - Security, Dependency, and Runtime Header Hardening
**Generated:** 2026-06-22

## Purpose

Map Phase 15 planned files to nearby codebase patterns so execution can reuse existing boundaries instead of inventing new architecture.

## File Pattern Map

| Planned File | Role | Closest Existing Analog | Pattern to Reuse |
|--------------|------|-------------------------|------------------|
| `package.json` | Direct dependency and script manifest | Current `package.json` scripts and Phase 10 test exception | Preserve existing script names; add only security-specific scripts if needed. |
| `pnpm-lock.yaml` | Dependency lockfile | Current lockfile | Update through `pnpm install`/`pnpm up`, not manual editing. |
| `.planning/phases/teavision-15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md` | Phase evidence artifact | `.planning/phases/*/*-VERIFICATION.md` and `.planning/research/SUMMARY.md` | Keep command, before/after counts, residual rationale, and exact dates. |
| `next.config.ts` | Next runtime config | Existing redirects/images/cacheComponents in `next.config.ts`; local Next headers docs | Add `poweredByHeader: false` and `headers()` while preserving existing config keys. |
| `src/lib/security/headers.ts` | Testable header/CSP policy builder | `src/lib/seo/noindex.ts`, `src/lib/env/*.ts` | Named exports only, pure helpers, no client directive, no default export. |
| `src/lib/security/headers.test.ts` | Unit tests for header/CSP helper | `src/lib/seo/site-url.test.ts`, `src/lib/env/read.test.ts` | Vitest node tests with explicit strings and no runtime network. |
| `scripts/component-contracts/production-boundaries.test.mjs` or new `security-headers.test.mjs` | Contract checks | `scripts/component-contracts/rate-limit.test.mjs` | Use Node test runner and file reads for lightweight source contract checks. |
| `src/app/(storefront)/account/_components/login-panel/login-panel.tsx` | OAuth-start link call site | Current `LoginPanel` and `Button` LinkProps pass-through | Add `prefetch={false}` only for direct `/account/login/start` button. |
| `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx` | Legacy OAuth-start link call site | Current `LegacyBridge` test mock for Button | Add `prefetch={false}` only for direct legacy bridge primary link. |
| `src/app/(storefront)/account/_components/*/*.test.tsx` | Component behavior tests | `legacy-bridge.test.tsx`, Storybook play tests | Mock `Button`/`Link` only when needed; assert href and prefetch behavior. |
| `src/app/(storefront)/account/login/start/route.test.ts` | OAuth origin tests | Existing route tests | Extend canonical origin cases; do not call live Shopify. |
| `docs/testing/customer-accounts-setup.md` | Owner/admin launch checklist | Existing Customer Accounts setup doc | Add Phase 15 callback/logout and owner-gated live OAuth evidence section. |
| `src/lib/rate-limit/index.ts` | Public abuse-control boundary | Current `RateLimitStore`, `checkRateLimit`, `getClientIpFromHeaders` | Keep shared helper; add production posture and trusted header handling here. |
| `src/lib/env/server.ts` | Server env helpers | Existing `shouldWarnAboutRateLimitMemoryFallback()` | Add explicit production posture/trusted-header helpers, no browser exposure. |
| `.env.example` | Operator configuration | Current rate-limit docs in `docs/conventions.md` | Document exact `RATE_LIMIT_*` keys and safe defaults. |
| `src/lib/contact/actions.ts` | Contact/newsletter/NPD/wholesale Server Actions | Existing validation + honeypot + rate limit flow | Preserve user-safe copy; replace raw provider error logs with redacted structured logs. |
| `src/app/api/search/suggestions/route.ts` | Public search API route | Existing 429 handling | Keep response shape stable; ensure rate-limit configuration failure returns user-safe 429/503 without leaking internals. |
| `scripts/security/probe-production-security.mjs` | Production header/audit probe | `scripts/component-contracts/*.test.mjs`, Playwright fake server lifecycle | Node script, explicit route list, fails on missing headers or `x-powered-by`. |
| `.planning/phases/teavision-15-security-dependency-and-runtime-header-hardening/15-RUNTIME-SECURITY-EVIDENCE.md` | Final Phase 15 evidence | `docs/testing/cart-checkout-uat.md`, Customer Accounts setup doc | Separate automated local/fake proof from owner-gated live proof. |

## Cross-Cutting Patterns

- Use named exports only.
- Keep server-only security helpers out of client components.
- Preserve existing fake-Shopify and fake Customer Account test boundaries.
- Do not run real Shopify hosted checkout, payment, shipping, tax, order, success redirect, or live Customer Account OAuth tests without owner approval.
- Do not run `pnpm codegen` or touch generated Shopify types unless dependency upgrades genuinely require it.
- Use local Next 16 docs before implementation code touches headers or CSP.

## PATTERN MAPPING COMPLETE

