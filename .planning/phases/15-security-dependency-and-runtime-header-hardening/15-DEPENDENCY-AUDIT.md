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

## Residual Findings

Pending remediation.

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
