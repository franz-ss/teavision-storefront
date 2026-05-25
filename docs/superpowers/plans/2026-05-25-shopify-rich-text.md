# Shopify Rich Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Shopify-authored HTML render consistently, accessibly, and safely through one reusable `RichText` component.

**Architecture:** Keep sanitization in the server-only Shopify content layer and keep rendering in the UI primitive. `RichText` receives only branded `SanitizedHtml`, applies design-system prose styles, and becomes the shared renderer for Shopify page, article, collection, and compact rich text surfaces.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, Tailwind 4 utilities, `sanitize-html`, Storybook 10, TypeScript strict mode.

---

## File Map

- Modify: `src/lib/shopify/html-content.ts`
  - Owns the Shopify HTML trust boundary.
  - Exports branded `SanitizedHtml`.
  - Defines sanitizer profiles and transforms for links, images, headings, tables, and unsupported embeds.
- Modify: `src/components/ui/rich-text/rich-text.tsx`
  - Owns the React renderer and all prose styling.
  - Accepts sanitized HTML only.
  - Adds variants for default page prose, article prose, compact prose, and disclosure prose if needed.
- Modify: `src/components/ui/rich-text/rich-text.stories.tsx`
  - Documents expected Shopify HTML behavior in Storybook.
  - Adds edge-case stories for security, tables, media, long content, and malformed merchant markup.
- Modify: `src/app/(storefront)/pages/[...slug]/static-page-content.tsx`
  - Keeps using `sanitizeShopifyPageBodyHtml(page.body)` and `RichText`.
  - Optionally passes `variant="page"` once variants exist.
- Modify: `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`
  - Replace local article body class constant and direct `dangerouslySetInnerHTML` with sanitizer + `RichText variant="article"`.
- Modify: `src/components/collection/collection-story-disclosure/collection-story-disclosure.tsx`
  - Replace duplicated rich text selector styles with sanitizer + `RichText variant="compact"` or `variant="disclosure"`.

---

## Task 1: Define Sanitizer Profiles

**Files:**
- Modify: `src/lib/shopify/html-content.ts`

- [ ] **Step 1: Split sanitizer options into reusable profile builders**

Refactor the current `SHOPIFY_PAGE_BODY_OPTIONS` into a named base plus page profile:

```ts
const SHOPIFY_HTML_ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'caption',
  'div',
  'em',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
] satisfies sanitizeHtml.IOptions['allowedTags']

const SHOPIFY_HTML_ALLOWED_ATTRIBUTES: Record<
  string,
  sanitizeHtml.AllowedAttribute[]
> = {
  a: ['href', 'rel', 'target', 'title'],
  img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
}

function buildShopifyHtmlOptions(): sanitizeHtml.IOptions {
  return {
    allowedAttributes: SHOPIFY_HTML_ALLOWED_ATTRIBUTES,
    allowedSchemes: SAFE_LINK_SCHEMES,
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowedSchemesByTag: { img: ['https'] },
    allowedTags: SHOPIFY_HTML_ALLOWED_TAGS,
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: buildHeadingTransforms(),
  }
}
```

- [ ] **Step 2: Preserve the public sanitizer name**

Keep the existing exported function so current callers do not change:

```ts
export function sanitizeShopifyPageBodyHtml(html: string): SanitizedHtml {
  return sanitizeHtml(html, buildShopifyHtmlOptions()) as SanitizedHtml
}
```

- [ ] **Step 3: Add article and compact aliases only if callers need semantic clarity**

Use the same profile initially; this avoids pretending Shopify Pages, articles, and collection descriptions need different security behavior before they really do.

```ts
export function sanitizeShopifyArticleHtml(html: string): SanitizedHtml {
  return sanitizeShopifyPageBodyHtml(html)
}

export function sanitizeShopifyCompactHtml(html: string): SanitizedHtml {
  return sanitizeShopifyPageBodyHtml(html)
}
```

- [ ] **Step 4: Verify**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands pass without introducing `any`, direct generated type imports, or client-only code.

---

## Task 2: Upgrade `RichText` API And Styles

**Files:**
- Modify: `src/components/ui/rich-text/rich-text.tsx`

- [ ] **Step 1: Add variants**

Keep the component server-safe and avoid polymorphism unless a real caller needs it.

```tsx
type RichTextVariant = 'page' | 'article' | 'compact' | 'disclosure'

export type RichTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  html: SanitizedHtml
  variant?: RichTextVariant
}
```

- [ ] **Step 2: Group selector classes by responsibility**

Replace the single long constant with grouped constants:

```tsx
const RICH_TEXT_BASE_CLASS_NAME = cn(
  'type-body break-words text-default',
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_*]:!text-inherit',
)

const RICH_TEXT_LINK_CLASS_NAME = cn(
  '[&_a]:rounded [&_a]:!text-link [&_a]:underline [&_a]:underline-offset-4',
  '[&_a]:hover:!text-link-hover',
  '[&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-ring [&_a]:focus-visible:ring-offset-2 [&_a]:focus-visible:outline-none',
)

const RICH_TEXT_STRUCTURE_CLASS_NAME = cn(
  '[&_h2]:type-heading-02 [&_h2]:mt-10 [&_h2]:!text-strong',
  '[&_h3]:type-heading-03 [&_h3]:mt-8 [&_h3]:!text-strong',
  '[&_h4]:type-heading-04 [&_h4]:mt-8 [&_h4]:!text-strong',
  '[&_h5]:type-heading-05 [&_h5]:mt-6 [&_h5]:!text-strong',
  '[&_h6]:type-label [&_h6]:mt-6 [&_h6]:!text-strong',
)
```

- [ ] **Step 3: Add robust media and table behavior**

Tables should scroll horizontally on small screens. Images should not overflow.

```tsx
const RICH_TEXT_MEDIA_CLASS_NAME = cn(
  '[&_figure]:my-8 [&_figcaption]:type-body-sm [&_figcaption]:mt-3 [&_figcaption]:text-muted',
  '[&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-default',
)

const RICH_TEXT_TABLE_CLASS_NAME = cn(
  '[&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse',
  '[&_caption]:type-body-sm [&_caption]:mb-3 [&_caption]:text-muted',
  '[&_td]:border [&_td]:border-default [&_td]:p-3 [&_td]:align-top',
  '[&_th]:type-label [&_th]:border [&_th]:border-default [&_th]:bg-surface-sunken [&_th]:p-3 [&_th]:text-left [&_th]:align-top',
)
```

- [ ] **Step 4: Add variant spacing**

```tsx
const RICH_TEXT_VARIANT_CLASS_NAMES: Record<RichTextVariant, string> = {
  page: 'space-y-6',
  article: 'space-y-6',
  compact: 'type-body-sm space-y-4',
  disclosure: 'type-body-sm space-y-4',
}
```

- [ ] **Step 5: Render**

```tsx
export function RichText({
  html,
  className,
  variant = 'page',
  ...props
}: RichTextProps) {
  return (
    <div
      {...props}
      className={cn(
        RICH_TEXT_BASE_CLASS_NAME,
        RICH_TEXT_VARIANT_CLASS_NAMES[variant],
        RICH_TEXT_LINK_CLASS_NAME,
        RICH_TEXT_STRUCTURE_CLASS_NAME,
        RICH_TEXT_MEDIA_CLASS_NAME,
        RICH_TEXT_TABLE_CLASS_NAME,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 6: Verify**

Run:

```bash
pnpm lint
pnpm build
```

Expected: no type errors, no `className` concatenation, no raw color classes.

---

## Task 3: Expand Storybook Coverage

**Files:**
- Modify: `src/components/ui/rich-text/rich-text.stories.tsx`

- [ ] **Step 1: Add reusable cast helper for story fixtures**

Storybook fixtures can cast because they are intentionally documenting already-sanitized output.

```tsx
function sanitized(html: string): SanitizedHtml {
  return html as SanitizedHtml
}
```

- [ ] **Step 2: Add stories**

Create stories for:

```tsx
export const Default: Story = {
  args: {
    html: sanitized(`
      <h2>Wholesale page body</h2>
      <p>Shopify-authored content can include <strong>rich text</strong>, links, and supporting details.</p>
      <p><a href="https://www.teavision.com.au" target="_blank" rel="noopener noreferrer">External link</a></p>
      <ul>
        <li>Sanitized before render</li>
        <li>Styled through the design system</li>
      </ul>
    `),
    className: 'max-w-prose',
  },
}

export const TableContent: Story = {
  args: {
    html: sanitized(`
      <h2>Specification table</h2>
      <table>
        <caption>Example merchant table from Shopify</caption>
        <thead>
          <tr><th scope="col">Grade</th><th scope="col">Origin</th><th scope="col">Use</th></tr>
        </thead>
        <tbody>
          <tr><td>Organic</td><td>Sri Lanka</td><td>Blends and infusions</td></tr>
          <tr><td>Conventional</td><td>India</td><td>Bulk supply</td></tr>
        </tbody>
      </table>
    `),
    className: 'max-w-prose',
  },
}

export const MediaContent: Story = {
  args: {
    html: sanitized(`
      <figure>
        <img src="https://cdn.shopify.com/s/files/1/0000/0001/files/tea.jpg" alt="Loose leaf tea" loading="lazy" width="1200" height="800" />
        <figcaption>Merchant supplied imagery should stay responsive.</figcaption>
      </figure>
    `),
    className: 'max-w-prose',
  },
}

export const LongContent: Story = {
  args: {
    html: sanitized(`
      <p>VeryLongUnbrokenMerchantPastedStringVeryLongUnbrokenMerchantPastedStringVeryLongUnbrokenMerchantPastedString</p>
      <p><a href="https://example.com/a/really/really/really/really/really/long/path">A long pasted URL should wrap instead of breaking layout.</a></p>
    `),
    className: 'max-w-prose',
  },
}

export const Compact: Story = {
  args: {
    variant: 'compact',
    html: sanitized(`
      <p>Compact rich text supports collection summaries and disclosures.</p>
      <ul><li>Short line one</li><li>Short line two</li></ul>
    `),
    className: 'max-w-prose',
  },
}
```

- [ ] **Step 3: Verify stories locally**

Run:

```bash
pnpm storybook
```

Open:

```text
http://localhost:6006/?path=/story/ui-richtext--default
http://localhost:6006/?path=/story/ui-richtext--table-content
http://localhost:6006/?path=/story/ui-richtext--media-content
http://localhost:6006/?path=/story/ui-richtext--long-content
http://localhost:6006/?path=/story/ui-richtext--compact
```

Expected: text wraps, links focus visibly, tables scroll on narrow viewports, images fit within the prose column.

---

## Task 4: Consolidate Callers

**Files:**
- Modify: `src/app/(storefront)/pages/[...slug]/static-page-content.tsx`
- Modify: `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`
- Modify: `src/components/collection/collection-story-disclosure/collection-story-disclosure.tsx`

- [ ] **Step 1: Page body stays explicit**

Use:

```tsx
const bodyHtml = sanitizeShopifyPageBodyHtml(page.body)

return (
  <Section.Root>
    <Section.Container>
      <RichText html={bodyHtml} variant="page" />
    </Section.Container>
  </Section.Root>
)
```

- [ ] **Step 2: Article body uses the shared renderer**

Import:

```tsx
import { RichText } from '@/components/ui/rich-text'
import { sanitizeShopifyArticleHtml } from '@/lib/shopify/html-content'
```

Render:

```tsx
const contentHtml = sanitizeShopifyArticleHtml(article.contentHtml)

<RichText
  html={contentHtml}
  variant="article"
  className="mx-auto mt-10 max-w-prose"
/>
```

Then remove the local `ARTICLE_BODY_CLASS_NAME`.

- [ ] **Step 3: Collection disclosure uses sanitized rich text**

Change prop type:

```ts
import type { SanitizedHtml } from '@/lib/shopify/html-content'

type CollectionStoryDisclosureProps = {
  title: string
  html: SanitizedHtml
  defaultOpen?: boolean
  className?: string
}
```

Render:

```tsx
<RichText html={html} variant="disclosure" />
```

If the upstream caller currently passes raw collection HTML, sanitize there before passing the prop.

- [ ] **Step 4: Verify no duplicated rich text class constants remain**

Run:

```bash
rg "ARTICLE_BODY_CLASS_NAME|COLLECTION_BODY_CLASS_NAME|dangerouslySetInnerHTML" src
```

Expected: `dangerouslySetInnerHTML` remains only in trusted infrastructure places such as `RichText` and JSON-LD scripts, not scattered prose renderers.

---

## Task 5: Security Review Pass

**Files:**
- Modify only if review finds gaps:
  - `src/lib/shopify/html-content.ts`
  - `src/components/ui/rich-text/rich-text.tsx`

- [ ] **Step 1: Check sanitizer payloads manually**

Use these malicious or risky inputs as review fixtures:

```html
<script>alert(1)</script>
<img src="x" onerror="alert(1)">
<a href="javascript:alert(1)">Bad link</a>
<a href="//evil.example/path">Protocol relative</a>
<iframe src="https://www.youtube.com/embed/demo"></iframe>
<p style="color:red" onclick="alert(1)">Styled event text</p>
```

Expected sanitized behavior:

```html

<img alt="" loading="lazy" />
<a>Bad link</a>
<a>Protocol relative</a>

<p>Styled event text</p>
```

- [ ] **Step 2: Decide embed policy**

Default decision: do not allow iframes in Shopify Page HTML. If marketing needs YouTube, Maps, or catalog embeds later, create a separate vetted embed component or shortcode parser.

- [ ] **Step 3: Verify no raw `string` can reach `RichText`**

Run:

```bash
rg "RichText" src -n
```

Expected: every `html` prop is either already `SanitizedHtml` or is sanitized immediately before rendering.

---

## Task 6: Final Verification

**Files:**
- No code changes unless verification fails.

- [ ] **Step 1: Run static checks**

```bash
pnpm lint
pnpm build
```

Expected: both pass.

- [ ] **Step 2: Run Storybook visual checks**

```bash
pnpm storybook
```

Check the `UI/RichText` stories on desktop and mobile viewport widths.

- [ ] **Step 3: Manual acceptance criteria**

Confirm:

- `RichText` accepts only `SanitizedHtml`.
- Shopify page body rendering happens through `RichText`.
- Article and collection rich HTML no longer duplicate prose selector classes.
- Links have focus-visible styling.
- Images never overflow the prose column.
- Tables are readable on mobile through horizontal overflow.
- Duplicate page-level `h1` is avoided by sanitizer heading normalization.
- Unsafe tags, inline event handlers, inline styles, JavaScript URLs, and protocol-relative URLs are stripped.

---

## Self-Review

**Spec coverage:** The plan covers readability, maintainability, rendering consistency, accessibility, security, Shopify HTML handling, sanitization, styling, semantic markup, responsive behavior, edge cases, and testing.

**Placeholder scan:** No task relies on "TODO", "TBD", or unspecified error handling. Each task has exact files, code shape, commands, and expected results.

**Type consistency:** `RichText` continues to consume `SanitizedHtml`; new sanitizer aliases return the same branded type; callers move toward sanitized props rather than widening the renderer to raw strings.
