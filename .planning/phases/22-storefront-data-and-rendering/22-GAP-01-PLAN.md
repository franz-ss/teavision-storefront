---
phase: "22-storefront-data-and-rendering"
plan: "GAP-01"
type: gap_closure
source_uat: "22-UAT.md"
debug_session: ".planning/debug/homepage-main-section-streamed-empty.md"
requirements: [DATA-01, RENDER-01, RENDER-02, QUALITY-01]
depends_on: ["22-07"]
files_modified:
  - src/app/(storefront)/page.tsx
  - src/app/(storefront)/page.test.tsx
---

# Homepage Initial Server HTML Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the storefront `/` route includes the CMS-backed homepage body in the initial server-rendered output instead of streaming an initially blank main section.

**Architecture:** Keep `getHomepage()` as the single typed Sanity data boundary with `'use cache'`, `cacheTag('homePage', 'sanity-homepage')`, and `cacheLife('hours')`. Remove the route-level `connection()` + `Suspense fallback={null}` wrapper from the primary homepage body so the cached CMS content can render as server HTML. Keep JSON-LD code-owned and keep missing/invalid CMS content fail-loud rather than falling back to static fixtures.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, Next Cache Components, Vitest, Testing Library-free route rendering via `renderToStaticMarkup`.

---

## Root Cause

The UAT gap is caused by `src/app/(storefront)/page.tsx` putting the entire visible homepage body behind `<Suspense fallback={null}>` and calling `await connection()` inside `HomePageContent()`. Next 16 treats that subtree as request-time streamed content. Because the fallback is `null`, the first page shell can contain JSON-LD but no visible homepage body, including no CMS H1.

The Sanity homepage read does not need to be forced into that request-time streamed hole: `src/lib/sanity/home-page.ts` already caches the operation with `use cache`, `cacheTag('homePage', 'sanity-homepage')`, and `cacheLife('hours')`.

## File Responsibilities

- `src/app/(storefront)/page.test.tsx`: Route contract tests. Update tests so they render the default route export and fail if CMS section content only appears through the separate `HomePageContent()` helper or a null Suspense stream.
- `src/app/(storefront)/page.tsx`: Homepage route. Render CMS homepage content directly in the default async route output using `getHomepage()`. Remove `connection()` and the route-wide null Suspense boundary from the visible homepage path.

## Task 1: Add A Failing Regression Test

**Files:**
- Modify: `src/app/(storefront)/page.test.tsx`

- [ ] **Step 1: Update route test imports**

Remove the `HomePageContent` named import and the mocked `connection()` boundary, because the regression test should prove the default route output contains the CMS body.

```tsx
import { readFile } from 'node:fs/promises'

import { renderToStaticMarkup } from 'react-dom/server'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HomepageContent } from '@/lib/sanity/home-page'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/homepage-json-ld'

import * as pageModule from './page'

const routeMocks = vi.hoisted(() => ({
  getHomepage: vi.fn(),
  sendNewsletterSignupAction: vi.fn(),
  submitContactFormAction: vi.fn(),
  withNoindexRobots: vi.fn((metadata: unknown) => metadata),
}))
```

- [ ] **Step 2: Remove the `next/server` mock**

Delete this block from `src/app/(storefront)/page.test.tsx`:

```tsx
vi.mock('next/server', () => ({
  connection: routeMocks.connection,
}))
```

Also remove all `routeMocks.connection.mockReset()` and `routeMocks.connection.mockResolvedValue(undefined)` lines from `beforeEach()`.

- [ ] **Step 3: Render the default route in the test helper**

Replace the existing `renderHomePage()` and `renderHomePageShell()` helpers with this single helper:

```tsx
async function renderHomePage(homepage = homepageFixture()) {
  routeMocks.getHomepage.mockResolvedValue(homepage)

  const element = await pageModule.default()

  return renderToStaticMarkup(element as ReactNode)
}
```

- [ ] **Step 4: Update JSON-LD and section tests to use the default output**

Replace the JSON-LD test body with:

```tsx
it('keeps the homepage H1 singular and emits code-owned JSON-LD in the default route output', async () => {
  const html = await renderHomePage()
  const jsonLdNodes = readJsonLdNodes(html)

  expect(html.match(/<h1\b/g)).toHaveLength(1)
  expect(jsonLdNodes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': organizationJsonLd['@type'],
        name: organizationJsonLd.name,
      }),
      expect.objectContaining({
        '@type': websiteJsonLd['@type'],
        name: websiteJsonLd.name,
      }),
    ]),
  )
})
```

Keep the existing section-order test, but it should now call the updated `renderHomePage()` helper, which renders the default route export instead of `HomePageContent()`.

- [ ] **Step 5: Add a source guard against reintroducing the blank streamed shell**

Extend the existing source test with these assertions:

```tsx
expect(source).not.toContain("from 'next/server'")
expect(source).not.toContain('connection()')
expect(source).not.toContain('fallback={null}')
expect(source).not.toContain('<Suspense')
```

The full source test should still assert no static homepage fixture import:

```tsx
it('keeps static homepage fixture content and blank streamed shells out of the live route source', async () => {
  const source = await readFile(
    new URL('./page.tsx', import.meta.url),
    'utf8',
  )

  expect(source).not.toContain('@/components/homepage/content')
  expect(source).not.toContain('HOME_TITLE')
  expect(source).not.toContain('HOME_DESCRIPTION')
  expect(source).not.toContain('HOMEPAGE_HERO_FIXTURE')
  expect(source).not.toContain("from 'next/server'")
  expect(source).not.toContain('connection()')
  expect(source).not.toContain('fallback={null}')
  expect(source).not.toContain('<Suspense')
})
```

- [ ] **Step 6: Run the focused route test and confirm it fails**

Run:

```bash
pnpm test:unit -- "src/app/(storefront)/page.test.tsx"
```

Expected before implementation: FAIL. The failure should show that the default route output lacks CMS section markers/content or that `page.tsx` still imports `next/server`, uses `connection()`, or contains the null Suspense boundary.

## Task 2: Render CMS Homepage Body In Initial Server Output

**Files:**
- Modify: `src/app/(storefront)/page.tsx`

- [ ] **Step 1: Remove streaming-only imports**

Delete these imports from `src/app/(storefront)/page.tsx`:

```tsx
import { connection } from 'next/server'
import { Suspense } from 'react'
```

- [ ] **Step 2: Remove `connection()` from metadata**

Change `generateMetadata()` to read the cached homepage directly:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()
  const { seo } = homepage

  return withNoindexRobots({
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalPath,
      type: 'website',
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage.src,
              alt: seo.ogImage.alt,
              width: seo.ogImage.width,
              height: seo.ogImage.height,
            },
          ]
        : undefined,
    },
    alternates: { canonical: seo.canonicalPath },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  })
}
```

- [ ] **Step 3: Make the default route async and render all sections directly**

Replace the current `HomePage()` and `HomePageContent()` exports with one default async route export:

```tsx
export default async function HomePage() {
  const homepage = await getHomepage()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeInlineJson(websiteJsonLd) }}
      />

      <div className="bg-paper">
        <HomepageHero hero={homepage.hero} />
        <ProductRange
          cards={homepage.productRange.cards}
          intro={homepage.productRange.intro}
        />
        <HomepageNewsletter
          action={sendNewsletterSignupAction}
          intro={homepage.newsletter.intro}
        />
        <PrivateLabel
          cards={homepage.privateLabel.cards}
          intro={homepage.privateLabel.intro}
        />
        <OrganicHerbs {...homepage.organicHerbs} />
        <SupplyChain {...homepage.supplyChain} />
        <CertificationCoverage {...homepage.certificationCoverage} />
        <SupplyChainProtection {...homepage.supplyChainProtection} />
        <Testimonials {...homepage.testimonials} />
        <TeaJournal {...homepage.teaJournal} />
        <ContactSection action={submitContactFormAction} {...homepage.contact} />
        <Cta {...homepage.catalogueCta} />
        <Faq {...homepage.faq} />
      </div>
    </>
  )
}
```

Do not add a new helper component in this file. The route file already has the allowed Next default component; keeping the body inline follows the repo rule against multiple React component declarations in one file.

- [ ] **Step 4: Run the focused route test**

Run:

```bash
pnpm test:unit -- "src/app/(storefront)/page.test.tsx"
```

Expected: PASS. The default route output should contain the exact 13-section order, CMS H1, JSON-LD, action handoffs, and no static fixture import.

## Task 3: Verify Cache Components And Build Behavior

**Files:**
- No source edits unless a command fails.

- [ ] **Step 1: Run focused regression suite**

Run:

```bash
pnpm test:unit -- "src/app/(storefront)/page.test.tsx" src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run lint and typecheck**

Run:

```bash
pnpm lint
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS with `/` no longer relying on an empty route-wide Suspense fallback for the visible homepage body.

If `pnpm build` fails because the Sanity homepage singleton or required render-critical content is missing, do not reintroduce `connection()` plus `fallback={null}`. That failure is the fail-loud behavior surfacing at build/prerender time. Restore valid seeded Sanity homepage content or adjust the environment used for the build, then re-run `pnpm build`.

- [ ] **Step 4: Commit the gap fix**

Run:

```bash
git add "src/app/(storefront)/page.tsx" "src/app/(storefront)/page.test.tsx"
git commit -m "fix(22): render homepage CMS body in initial HTML"
```

## Plan Self-Review

- Spec coverage: Covers the UAT gap by proving the default `/` route output includes CMS content, one H1, JSON-LD, and exact section order without a blank Suspense shell.
- Placeholder scan: No placeholder implementation steps remain.
- Type consistency: Uses existing `HomepageContent`, `getHomepage()`, action imports, and section prop names from the current route/tests.
