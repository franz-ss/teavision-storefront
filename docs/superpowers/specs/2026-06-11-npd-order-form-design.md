# NPD Order Form Page — Design

Date: 2026-06-11
Status: Approved

## Goal

Rebuild the legacy "New Product Development — Order Details" form (previously a
raw HTML/JS page posting to formsubmit.co) as a first-class storefront page at
`/pages/new-product-development-order-form`, using the existing design system,
form primitives, and Server Action email pipeline.

## Decisions (user-confirmed)

1. **Submission**: Server Action + Resend (`sendNpdOrderAction`), matching the
   `sendCustomTeaBlendAction` pattern — honeypot, server-side validation,
   shared `contact` rate limit, email to info@teavision.com.au.
2. **Interactivity**: keep all original behaviors except the client-generated
   PDF attachment. The email body carries all submitted data.
3. **Flavour UI**: searchable panel following the existing `FlavourPicker`
   pattern (search filter, checkbox cards, removable chips), with the full
   112-flavour list from the legacy form. Max 3 flavours per blend.

## Files

| File | Purpose |
| --- | --- |
| `src/lib/contact/npd-order.ts` | Shared constants: page paths/meta, flavour list (verbatim legacy values), product types, timeframes, limits, validation guards |
| `src/lib/contact/actions.ts` | Add `sendNpdOrderAction` (and `FormData`-only wrapper if needed) |
| `src/app/(storefront)/pages/new-product-development-order-form/page.tsx` | Server Component, noindex metadata, hero + form sections |
| `.../_components/npd-order-form.tsx` | `'use client'` form shell: order details, product type, blend mode, contact, naturopath upsell, submit/success/error |
| `.../_components/blend-fields.tsx` | Per-blend card: name, profile, organic, natural flavouring toggle, suggestions, notes |
| `.../_components/flavour-select.tsx` | Searchable flavour panel with chips, max-3 enforcement |

Component split keeps one component per file per repo rules; all are route-only
(`_components/`), so no Storybook story is required.

## Form model

- **Order details**: company (required), date (required), estimated timeframe
  (select), conditional "other timeframe" input when `Other` selected.
- **Product type**: multi-select checkboxes (5 options, MOQ notes preserved).
- **Brand certified organic**: Yes/No radio.
- **Blend mode**: one / multiple radio; multiple reveals count select (2–10).
  `blendCount` blend cards render, each with independent state.
- **Per blend**: name (required), profile, certified organic Y/N, add natural
  flavouring Y/N (~20% cost note); Yes reveals flavour panel (max 3);
  ingredient/aroma/flavour suggestions, additional notes (textareas).
- **Contact**: first name, last name, email (required), phone (optional).
- **Naturopath certification**: optional checkbox, $250 per SKU/blend note.
- **Anti-spam**: `website` honeypot field (sr-only), same as contact form.

Field naming: camelCase form field names (`company`, `blend1Name`, …) read via
`FormData`; blends submitted as indexed groups. Flavour values submitted
verbatim (legacy ALL-CAPS strings) but displayed with normal site typography.

## Server Action

`sendNpdOrderAction(formData)` in `src/lib/contact/actions.ts`:

1. Honeypot filled → pretend success.
2. Validate: required fields present and within limits; timeframe, product
   types, and flavours must be members of the canonical lists in
   `npd-order.ts`; ≤ 3 flavours per blend; blend count 1–10.
3. Rate limit via existing `contact` namespace.
4. Format a plain-text email (all meta + per-blend sections) and send via
   Resend to info@teavision.com.au, replyTo submitter. Subject:
   "New Teavision NPD form submission".

## UI / design system

- Hero: `Section.Root tone="brand"` band with eyebrow, H1
  "New Product Development — Order Details", lede.
- Form: `Section.Root tone="surface"` → `Section.Container`; card groups
  (`bg-card`, `border-hairline`, `rounded-lg`) per fieldset.
- Primitives: `TextInput`, `Textarea`, `Select`, `Checkbox`, `FormLabel`,
  `Button`; type classes (`type-eyebrow`, `type-heading-*`, `type-body*`),
  token colors only.
- Success/error states mirror `ContactForm` (brand-tint success card,
  danger-tint error alert, `useTransition` pending state).

## Out of scope

- Client-generated PDF attachment (dropped).
- formsubmit.co endpoint (replaced).
- Indexing/SEO promotion — page ships `withNoindexRobots` like the
  custom-tea-blends page until the business says otherwise.
