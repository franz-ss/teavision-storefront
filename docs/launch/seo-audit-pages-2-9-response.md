# SEO Audit Response — Pages 2–9 ("Staging Site" audit)

Status: prepared for the SEO consultant • Last updated: 2026-06-29

This document responds, point by point, to the audit items on pages 2–9 of
_SEO Audit - Teavision Staging Site_. Each item lists what was requested, the
current status, and the supporting evidence.

> Note on the staging build: the audit was run against an earlier staging
> deployment. Several requested items were already implemented in the current
> build; those are marked **Already in place** with the file that proves it.

---

## Summary

| # | Audit item (page) | Status |
|---|-------------------|--------|
| 1 | Display the H1 on banner / main-category collection pages (p2, p5) | ✅ **Fixed** |
| 2 | "Read more" content below the product grid (p4) | ✅ Already in place |
| 3 | Multiple H1s while browsing — collection & product pages (p2–3, p6) | ✅ **Resolved** (see evidence; not visible to Google) |
| 4 | Remove brand suffix from SEO-targeted page titles, keep on products (p8–9) | ✅ **Fixed** / already in place |
| 5 | Blog listing URL `/blogs/teavision-blogs/` → `/blog/` + 301s (p8) | ⏸️ Deferred to migration (as you noted) |
| 6 | `lang` tag `en` → `en-AU` (p9) | ✅ Already in place |
| 7 | Meta descriptions, internal linking (p9) | ✅ No action required |

---

## 1. Visible H1 on banner / main-category collection pages — Fixed

**Requested (p2, p5):** "the main H1 text isn't being displayed … resolve this by
displaying the H1." Before the product grid, show a Banner Image (optional), an
H1 text, a brief intro, and the breadcrumb — like the other collection pages.

**Done.** Banner-image collection pages now render, in order: banner image → a
visible page-level `<h1>` (same prominence as the green-band and rich-hero
collections) → brief intro → breadcrumb. The breadcrumb's current-page item,
which was previously the page's `<h1>`, is now a non-heading `<span aria-current="page">`.

- Implementation: `src/app/(storefront)/collections/[handle]/_components/hero.tsx`
- Locked by an SSR test asserting exactly one visible `<h1>` per page:
  `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`

This was previously a deliberate "compact heading" design (the H1 lived in the
breadcrumb). Per your request, it is now a displayed heading. Note: the previous
crumb-H1 was still real, user-visible text — not hidden/black-hat — but a
displayed heading is the better, clearer treatment and is what is now shipped.

## 2. "Read more" content below the product grid — Already in place

The collection "Read more" story block (`StoryDisclosure`) renders **after** the
product grid in the current build.

- Evidence: `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`
  (the read-more section follows `ProductList`).

## 4. Brand suffix in page titles — Fixed / already in place

**Requested (p8–9):** remove the automatic `| Teavision` suffix from Homepage,
Collection, and SEO-targeted Service page titles (it overflows the optimal
pixel length); product pages may keep it.

- Homepage and collection pages already emit an **absolute** title with no
  suffix (`title: { absolute: … }`).
- Most service/content pages were already absolute; the two remaining indexed
  pages still inheriting the suffix (`/pages/download-catalogues`,
  `/pages/how-long-does-bulk-tea-last`) were converted to absolute titles.
- **Product pages keep the suffix** (`title: product.title` → `… | Teavision`),
  exactly as you specified.
- Policy pages (privacy, refund, cookie preferences) are `noindex`, so the title
  never appears in search results — left unchanged.

## 5. Blog listing slug `/blog/` — Deferred to migration

You noted this is to be handled "during the migration," with 301 redirects. No
change in this pass; tracked for the migration step.

## 6. `lang` tag `en-AU` — Already in place

The document already declares `<html lang="en-AU">` (`src/app/layout.tsx`).

## 7. Meta descriptions & internal linking — No action

Per the audit these are intact; internal linking is present via "You Might Like"
and "Related Products" sections. No change required.

---

## 3. "Multiple H1s while browsing" — Resolved (and not visible to Google)

**Observed (p2–3, p6):** while clicking through the site, a heading-inspector
browser extension shows several `<h1>`s accumulating — "coming from content that
is actually not on the page … other Main Category Pages as well as the Homepage,"
and on product pages "different every time I visit."

### What causes it

The storefront is built on Next.js 16 **Cache Components**, which keeps up to
**three** recently-visited routes mounted in the live DOM using React's
`<Activity mode="hidden">` (rendered `display:none`) so that client-side
("soft") navigation between pages is instant and preserves UI state. Each
retained route keeps its own `<h1>` in the DOM. A tool that browses by clicking
through pages therefore sees the H1s of the last few routes accumulate — which is
exactly what the extension reported (and why it differs each visit, depending on
the path taken).

This only happens **inside one continuous click-through browsing session**. It
does not exist in any single page's server HTML.

### Why it is not an SEO problem

**a) Google never assembles that DOM.** Google crawls and indexes one URL at a
time in a fresh, isolated rendering session. It discovers links by queuing them
as separate URLs to fetch later — it does **not** click links or perform
in-session soft navigation, and it does not carry browser state between page
renders. So the multi-route accumulated DOM that the extension produces is never
created during Google's crawl → render → index pipeline. Each individual URL
ships exactly one `<h1>`, and that single-H1 HTML is what Google indexes.

- _"Googlebot then parses the response for other URLs in the href attribute of
  HTML links and adds the URLs to the crawl queue. … a headless Chromium renders
  the page and executes the JavaScript."_ — Google Search Central, JavaScript SEO
  Basics (https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- _"WRS does not retain state across page loads: Local Storage and Session
  Storage data are cleared across page loads. HTTP Cookies are cleared across
  page loads."_ — Google Search Central, Fix Search-related JavaScript problems
  (https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript)
- Corroborating: _"Googlebot doesn't 'click' links or buttons like a human …
  each page render occurs in a fresh browser session, without retaining cookies
  or state from previous renders."_ — Search Engine Journal
  (https://www.searchenginejournal.com/googlebot-doesnt-click-on-buttons-what-to-use-instead/400242/)

**b) Even if it did, multiple H1s are not a ranking or indexing issue.** Google's
stated, repeated position (John Mueller, unchanged through 2024–2026):

- _"You can use H1 tags as often as you want on a page. There is no limit … Your
  site is going to rank perfectly fine with no H1 tags or with five H1 tags."_
- _"Our systems do not have a problem when it comes to multiple H1 headings on a
  page. That is a fairly common pattern on the web."_
  — Search Engine Journal (https://www.searchenginejournal.com/h1-headings-for-google/406720/)

**c) The retained H1s are not deceptive and not seen by assistive tech.** They
are identical, real headings served to users and crawlers alike (not cloaking),
and `display:none` Activity nodes are removed from the accessibility tree, so
screen readers and `getByRole('heading')` do not see them either.

### What we guarantee instead

Rather than degrade the storefront's instant navigation, we hold the invariant
that actually matters for search: **each route, loaded on its own, ships exactly
one visible `<h1>`** — mirroring how Googlebot fetches and renders each URL. This
is enforced by:

- the per-route SSR test for collections (one `<h1>` per page), and
- `tests/e2e/h1-correctness.spec.ts`, which loads each SEO-critical route with a
  fresh navigation and asserts exactly one visible `<h1>` per standalone load.

### Why we did not disable Cache Components or force full page reloads

- **Disabling Cache Components** would remove the streaming / instant-navigation
  behaviour the storefront relies on, to fix something Google never sees.
- **Forcing full-document navigation** on product/collection links would tear
  down the SPA on every click (full reload, white flash, lost streaming), and is
  only a partial, regression-prone mitigation (any future in-app link
  reintroduces the retained DOM). `prefetch={false}` does **not** prevent the
  retention.

Cache Components remains enabled.

---

### Verification artefacts

- Per-route single-H1: collection SSR test + `tests/e2e/h1-correctness.spec.ts`.
- Server-HTML crawlability re-proof: `scripts/seo/probe-crawlable-html.mjs`.
- Research backing section 3 (Google rendering + multiple-H1 stance), with
  adversarial verification of each cited claim: see the Phase 19 research record.
