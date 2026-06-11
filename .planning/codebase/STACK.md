# Technology Stack

**Analysis Date:** 2026-06-11

## Languages

**Primary:**
- TypeScript 5.x - Application code, configuration, route handlers, Server Actions, tests, and scripts across `src/`, `tests/`, `*.config.*`, and `codegen.ts`.
- TSX / React 19.2.4 - Server Components, Client Components, Storybook stories, and page UI under `src/app/` and `src/components/`.

**Secondary:**
- JavaScript / ESM - Node scripts and custom ESLint rules in `scripts/*.mjs` and `scripts/eslint-rules/*.mjs`.
- GraphQL SDL/documents - Shopify Storefront API operation documents in `src/lib/shopify/queries/*.graphql`.
- CSS - Tailwind 4 token source and global typography/utilities in `src/app/globals.css`.
- Markdown - Project docs and planning material in `README.md`, `docs/`, and `.planning/`.

## Runtime

**Environment:**
- Node.js - Required by Next.js, Storybook, Vitest, Playwright, GraphQL Codegen, and scripts. No `.nvmrc` is present; `package.json` uses `@types/node` `^20`, and scripts use Node 20-compatible ESM patterns.
- Next.js runtime - App Router route handlers, Server Components, Server Actions, `next/font/google`, image optimization, `next/cache`, `next/headers`, and `next/script`.
- Browser runtime - Interactive leaf components under `src/components/` and route `_components/` use `'use client'`, React hooks, DOM APIs, `MutationObserver`, and lazy third-party script loading.

**Package Manager:**
- pnpm workspace - `pnpm-workspace.yaml` includes the root package only and explicitly allows native/package build steps for `esbuild`, `sharp`, and `unrs-resolver`.
- Lockfile: present at `pnpm-lock.yaml` with lockfile version `9.0`.
- `package.json` does not declare a `packageManager` field, so use the project commands documented in `README.md` and `AGENTS.md`.

## Frameworks

**Core:**
- Next.js `16.2.4` - Headless storefront App Router, Cache Components, route handlers, metadata, image config, and redirects. Config lives in `next.config.ts`.
- React `19.2.4` and `react-dom` `19.2.4` - Component rendering for Server Components and interactive Client Components.
- Tailwind CSS `4.2.4` - Utility styling and design tokens. PostCSS integration is configured in `postcss.config.mjs`; tokens live in `src/app/globals.css`.
- Next.js 16 Cache Components - Enabled with `cacheComponents: true` in `next.config.ts`; project skill guidance is in `.agents/skills/next-cache-components/SKILL.md`.

**Testing:**
- Vitest `^4.1.8` - Unit/integration runner configured in `vitest.config.mts`; commands are split across `test:unit`, `test:integration`, and `test:stories` in `package.json`.
- Playwright `^1.60.0` - E2E cart-to-checkout handoff tests configured in `playwright.config.ts` with a fake Shopify server.
- Storybook `^10.4.1` with `@storybook/nextjs-vite` - Component documentation and interaction surface configured in `.storybook/main.ts` and `.storybook/preview.ts`.
- Node built-in test runner - Contract tests run with `node --test` against `scripts/eslint-rules/*.test.mjs` and `scripts/component-contracts/*.test.mjs`.

**Build/Dev:**
- Next CLI - `pnpm dev`, `pnpm build`, and `pnpm start` are defined in `package.json`.
- TypeScript compiler - `pnpm typecheck` runs `tsc --noEmit`; compiler settings live in `tsconfig.json`.
- ESLint 9 flat config - `eslint.config.mjs` combines Next core web vitals, Next TypeScript rules, Storybook rules, import ordering, and custom project rules from `scripts/eslint-rules/`.
- Prettier `^3.8.3` with `prettier-plugin-tailwindcss` `^0.8.0` - Formatting is configured in `.prettierrc`.
- GraphQL Code Generator `^6.3.1` - `pnpm codegen` loads `.env.local` via `dotenv-cli` and writes Shopify typed documents to `src/lib/shopify/types/generated/` using `codegen.ts`.
- Husky `^9.1.7` - Git hooks in `.husky/pre-commit` and `.husky/pre-push` run lint, contracts, typecheck, and build gates.

## Key Dependencies

**Critical:**
- `next` `16.2.4` - Owns App Router routing in `src/app/`, route handlers in `src/app/api/`, cache invalidation, image optimization, metadata, and Server Actions.
- `react` / `react-dom` `19.2.4` - Required for all component code in `src/app/` and `src/components/`.
- `graphql` `^16.13.2` and `@graphql-typed-document-node/core` `^3.2.0` - Used by `src/lib/shopify/client.ts` to print typed Shopify GraphQL documents.
- `next-sanity` `^13.0.6` and `@sanity/image-url` `^2.1.1` - Sanity blog client, webhook parsing, and image URL generation in `src/lib/sanity/client.ts` and `src/app/api/webhooks/sanity/route.ts`.
- `resend` `^6.12.2` - Email delivery for contact, wholesale, NPD, and newsletter Server Actions in `src/lib/contact/actions.ts`.
- `sanitize-html` `^2.17.4` - Sanitizes Shopify HTML and Searchanise text in `src/lib/shopify/html-content.ts` and `src/lib/searchanise/search.ts`.

**Infrastructure:**
- `@graphql-codegen/cli` `^6.3.1` and `@graphql-codegen/client-preset` `^5.3.0` - Generates typed Shopify Storefront API documents from `src/lib/shopify/queries/*.graphql`.
- `@storybook/nextjs-vite` `^10.4.1`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-vitest`, and `@chromatic-com/storybook` - Storybook docs/testing surface in `.storybook/`.
- `@playwright/test` `^1.60.0` and `@vitest/browser-playwright` `^4.1.8` - Browser automation for E2E and Storybook tests.
- `clsx` `^2.1.1`, `tailwind-merge` `^3.5.0`, and `class-variance-authority` `^0.7.1` - Class composition utilities; project code should use `cn()` from `src/lib/utils.ts`.
- `embla-carousel-react` `^8.6.0` - Carousel UI behavior for product and packaging surfaces under `src/components/` and `src/app/(storefront)/pages/*/_components/`.
- `lucide-react` `^1.14.0` - Icon library for UI components.
- `@portabletext/react` `^6.2.0` - Renders Sanity Portable Text for blog components under `src/components/blog/`.
- `lighthouse` `^13.2.0` - Available for performance audits from dev tooling, though no project script currently wraps it.

## Configuration

**Environment:**
- Shopify storefront data requires `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`; failures are enforced in `src/lib/shopify/env.ts`.
- Shopify codegen requires the same Shopify env vars and reads them through `requiredToolEnv()` in `codegen.ts`.
- Test-only Shopify override uses `SHOPIFY_STOREFRONT_TEST_MODE` and `SHOPIFY_STOREFRONT_TEST_URL`, guarded to local hosts and blocked in production by `src/lib/shopify/env.ts`.
- Sanity requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_REVALIDATE_SECRET`; optional envs include `NEXT_PUBLIC_SANITY_API_VERSION` and `SANITY_API_READ_TOKEN` in `src/lib/sanity/env.ts`.
- Searchanise uses public env `NEXT_PUBLIC_SEARCHANISE_ENABLED` and `NEXT_PUBLIC_SEARCHANISE_API_KEY` in `src/lib/env/public.ts`.
- Trustoo uses public env `NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN` in `src/lib/env/public.ts`.
- Resend email delivery uses `RESEND_API_KEY` through `src/lib/env/server.ts` and `src/lib/contact/actions.ts`.
- SEO and runtime controls include `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `DISABLE_INDEXING`, `RATE_LIMIT_EXTERNAL_PROTECTION`, and `RATE_LIMIT_ALLOW_MEMORY_FALLBACK` in `src/lib/seo/site-url.ts`, `src/lib/seo/noindex.ts`, and `src/lib/env/server.ts`.
- `.env.example` and `.env.local` are present; `.env.local` must not be read or committed because it may contain secrets.

**Build:**
- `next.config.ts` enables Cache Components, sets build-time `BUILD_YEAR`, redirects legacy collection-product URLs, and allows remote images from `cdn.shopify.com`, `www.teavision.com.au/cdn/shop/**`, and `cdn.sanity.io/images/**`.
- `tsconfig.json` is strict, uses `moduleResolution: "bundler"`, `jsx: "react-jsx"`, and defines path aliases `@/components/*`, `@/lib/*`, and `@/*`.
- `eslint.config.mjs` enforces import order, disallows default exports in `src/components/**/*.tsx` and `src/lib/**/*.ts`, and applies custom UI rules against raw sections/buttons.
- `.prettierrc` disables semicolons, uses single quotes, trailing commas, and the Tailwind class sorting plugin.
- `postcss.config.mjs` wires `@tailwindcss/postcss`.
- `vitest.config.mts`, `vitest.storybook.config.mts`, and `playwright.config.ts` configure node tests, Storybook browser tests, and fake-Shopify E2E.
- `codegen.ts` targets Shopify Storefront API version `2026-04` and outputs generated artifacts to `src/lib/shopify/types/generated/`.

## Platform Requirements

**Development:**
- Install with `pnpm install`; run `pnpm dev` for Next.js on port 3000 and `pnpm storybook` for Storybook on port 6006.
- Use `pnpm codegen` after Shopify schema/query changes; it reads Shopify credentials from `.env.local` via `dotenv-cli`.
- Use `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:integration`, `pnpm test:e2e`, and `pnpm test:stories` according to change scope.
- Real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, and success-redirect tests are explicitly disallowed until store-owner approval; local E2E uses `tests/mocks/run-fake-shopify-server.ts`.

**Production:**
- Deployment target is a Node-capable Next.js hosting platform; project docs recommend Vercel in `docs/teavision-project-reference.md`, while repository code does not include provider-specific deployment config.
- Production must provide Shopify, Sanity, Resend, webhook, SEO, and rate-limit env vars as appropriate; missing Shopify credentials fail fast in `src/lib/shopify/env.ts`.
- Production rate limiting is in-memory unless an external/provider layer is declared with `RATE_LIMIT_EXTERNAL_PROTECTION=true` or the fallback is explicitly allowed with `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true`.
- Cache invalidation depends on incoming Shopify and Sanity webhooks at `src/app/api/webhooks/shopify/route.ts` and `src/app/api/webhooks/sanity/route.ts`.

---

*Stack analysis: 2026-06-11*
