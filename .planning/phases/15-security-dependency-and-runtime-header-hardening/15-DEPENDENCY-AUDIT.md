# Phase 15 Dependency Audit Evidence

## Baseline

| Field | Value |
|-------|-------|
| Command | `pnpm audit --audit-level moderate --json` |
| Date | 2026-06-22 |
| Exit code | 1 |
| Critical | 1 |
| High | 16 |
| Moderate | 18 |
| Low | 10 |
| Total | 45 |

## Runtime Exposure Classification

| Package | Severity band | Path root / owner | Runtime exposure | Initial classification |
|---------|---------------|-------------------|------------------|------------------------|
| `next` | high/moderate | Direct runtime dependency, `next-sanity`, Storybook Next integration | yes | Runtime blocker; patch direct Next 16 line first. |
| `postcss` | moderate | Next/Tailwind processing paths | mixed | Runtime build pipeline dependency; patch through direct parent upgrade/override. |
| `shell-quote` | critical | `@graphql-codegen/cli` dev tooling | no | Dev-only code generation path; critical finding must still be eliminated. |
| `vite` | high/moderate | Storybook, Vitest browser, Sanity/Lighthouse tooling | no | Dev/tooling path; remove high findings with parent upgrades and targeted overrides. |
| `undici` | high/moderate | Sanity/jsdom/actions tooling transitive paths | no | Tooling/server test dependency; high findings must be removed. |
| `ws` | high/moderate | Storybook/Vite/jsdom/Sanity tooling paths | no | Dev/test websocket dependency; high findings must be removed. |
| `form-data` | high | Sanity CLI/tooling path | no | Dev/tooling path; high finding must be removed. |
| `dompurify` | moderate | `next-sanity`/Sanity tooling path | no | Tooling/editor dependency; moderate residual only acceptable if dev-only. |
| `brace-expansion` | moderate | Sanity/tooling path | no | Tooling dependency; patch if compatible. |
| `tar` | moderate | Sanity/tooling path | no | Tooling dependency; patch if compatible. |
| `@opentelemetry/core` | moderate | Lighthouse/Sentry tooling path | no | Dev audit tooling path; document residual if parent cannot be advanced. |
| `uuid` | moderate | Sanity/tooling paths | no | Tooling dependency; patch by parent upgrade where practical. |
| `js-yaml` | moderate | Tooling/config parsing path | no | Dev/tooling path; document residual only if no compatible parent update. |

## Remediation Targets

### Direct upgrades

Starting command planned for Task 2:

```bash
pnpm up next@16.2.9 eslint-config-next@16.2.9 next-sanity@13.1.1 @storybook/nextjs-vite@10.4.6 @storybook/addon-a11y@10.4.6 @storybook/addon-docs@10.4.6 @storybook/addon-onboarding@10.4.6 @storybook/addon-vitest@10.4.6 storybook@10.4.6 @graphql-codegen/cli@7.1.3 lighthouse@13.4.0 --latest
```

### Targeted override candidates

```json
{
  "shell-quote": "1.8.4",
  "form-data": "4.0.6",
  "vite@^8.0.0": "8.0.16",
  "vite@^7.0.0": "7.3.5",
  "undici@^7.0.0": "7.28.0",
  "undici@^6.0.0": "6.27.0",
  "ws@^8.0.0": "8.21.0",
  "ws@^7.0.0": "7.5.11",
  "dompurify": "3.4.11",
  "brace-expansion": "5.0.6",
  "tar": "7.5.16",
  "postcss": "8.5.15"
}
```

## Task 2 Remediation Log

| Item | Result |
|------|--------|
| Planned direct-upgrade command | Rejected by pnpm 11.5.2 with `ERR_PNPM_LATEST_WITH_SPEC` because explicit versions cannot be combined with `--latest`. |
| Replacement direct-upgrade command | Ran the same pinned package list without `--latest`; completed successfully. |
| Direct runtime upgrades | `next` `16.2.4` -> `16.2.9`; `next-sanity` `^13.0.6` -> `^13.1.1`. |
| Direct tooling upgrades | `eslint-config-next` `16.2.4` -> `16.2.9`; Storybook packages `10.4.1` -> `10.4.6`; `@graphql-codegen/cli` `^6.3.1` -> `^7.1.3`; `lighthouse` `^13.2.0` -> `^13.4.0`; direct dev `vite` added at `8.0.16` so Storybook/Vitest peers resolve to the patched Vite 8 line. |
| Active overrides | pnpm 11 ignores `package.json#pnpm.overrides`, so active overrides live in `pnpm-workspace.yaml`: `postcss: 8.5.15` and `sanity: 5.29.0`. |
| Rejected override | `vite@^8.0.0: 8.0.16` removed because it made pnpm peer checking expect Vite 8 inside Sanity's Vite 7 toolchain. Direct dev `vite@8.0.16` replaced it and left Sanity's Vite 7 path intact. |
| Peer verification | `pnpm peers check` reported no peer dependency issues after the `sanity: 5.29.0` override. |
| Severity verification | `pnpm audit --audit-level high` exited 0 and reported only 1 low and 4 moderate findings. |

## Final Audit

| Field | Value |
|-------|-------|
| Command | `pnpm audit --audit-level moderate --json` |
| Date | 2026-06-22 |
| Exit code | 1 |
| Critical | 0 critical |
| High | 0 high |
| Moderate | 4 moderate |
| Low | 1 low |
| Total | 5 |
| Pass status | Pass for SEC-01 launch blocker threshold: 0 critical and 0 high. Moderate/low findings are documented below. |

`pnpm audit --audit-level high` exited 0 and reported: `5 vulnerabilities found; Severity: 1 low | 4 moderate`.

## Applied Changes

| Area | Change |
|------|--------|
| Next runtime | Upgraded `next` from `16.2.4` to `16.2.9`. |
| Next lint config | Upgraded `eslint-config-next` from `16.2.4` to `16.2.9`. |
| Sanity integration | Upgraded `next-sanity` from `^13.0.6` to `^13.1.1`; pinned auto-installed `sanity` peer to `5.29.0`. |
| Email runtime | Upgraded `resend` from `^6.12.2` to `^6.14.0`, removing the runtime `svix -> uuid@10.0.0` path. |
| Storybook tooling | Upgraded Storybook packages from `10.4.1` to `10.4.6`. |
| Codegen tooling | Upgraded `@graphql-codegen/cli` from `^6.3.1` to `^7.1.3`. |
| Audit tooling | Upgraded `lighthouse` from `^13.2.0` to `^13.4.0`. |
| Vite tooling | Added direct dev dependency `vite@8.0.16` so Storybook/Vitest peers resolve to the patched Vite 8 line. |
| Active pnpm overrides | `@sanity/uuid: 3.0.3`, `postcss: 8.5.15`, and `sanity: 5.29.0` in `pnpm-workspace.yaml`. |

## Residual Findings

| Package | Severity | Path root | Runtime exposure | Rationale / follow-up |
|---------|----------|-----------|------------------|-----------------------|
| `js-yaml` | moderate | `next-sanity -> sanity -> @sanity/cli -> @vercel/frameworks -> js-yaml@3.13.1` | no | Sanity CLI/tooling path. Not imported by storefront runtime code; retained because forcing a broad `js-yaml` major override across Vercel framework detection is higher compatibility risk than this moderate tooling residual. |
| `js-yaml` | moderate | `eslint -> @eslint/eslintrc -> js-yaml@4.1.1` and related ESLint tooling paths | no | Lint/config tooling path only. `pnpm lint` passes on the final graph. |
| `uuid` | moderate | `next-sanity -> sanity -> @sanity/cli -> typeid-js -> uuid@10.0.0` | no | Remaining `uuid@10.0.0` path is Sanity CLI tooling after `resend` runtime and `@sanity/uuid` paths were patched. Avoided broad `uuid` major override because it would cross package API boundaries. |
| `@opentelemetry/core` | moderate | `lighthouse -> @sentry/node -> @opentelemetry/core@1.30.1` | no | Lighthouse/Sentry audit tooling path. Not part of storefront runtime bundle. Revisit when Lighthouse/Sentry publishes an OpenTelemetry 2.8-compatible chain. |

## Verification

| Command | Exit | Result |
|---------|------|--------|
| `pnpm install --frozen-lockfile=false` | 0 | Passed after workspace overrides; peer install completed. |
| `pnpm peers check` | 0 | No peer dependency issues found. |
| `pnpm audit --audit-level high` | 0 | Passed: no critical or high findings. |
| `pnpm audit --audit-level moderate --json` | 1 | Expected residual: 1 low and 4 moderate; 0 critical and 0 high. |
| `pnpm lint` | 0 | Passed on final Phase 15 tree; Tailwind class check and ESLint completed. |
| `pnpm typecheck` | 0 | Passed on final Phase 15 tree; `tsc --noEmit`. |
| `pnpm build` | 0 | Passed on Next.js 16.2.9 with Cache Components enabled; generated 75 static pages. |
| `pnpm test:unit` | 0 | Passed; 51 test files, 200 tests. |
| `pnpm test:integration` | 0 | Passed; 9 test files, 43 tests. |
| `pnpm test:contracts` | 0 | Passed; 38 Node contract subtests. |
| `pnpm test:e2e` | 0 | Passed; 4 fake-Shopify Playwright tests stopping at fake checkout handoff. |
| `node scripts/security/probe-production-security.mjs http://127.0.0.1:4316` | 0 | Passed; 7 representative routes returned required headers and no `x-powered-by`. |
| `git diff -- src/lib/shopify/types/generated` | 0 | Empty; generated Shopify types untouched. |
