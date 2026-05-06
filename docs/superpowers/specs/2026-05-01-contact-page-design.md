# Contact Page — Design Spec

**Date:** 2026-05-01
**Status:** Approved

---

## Goal

Deliver a `/pages/contact` route that replaces the generic live contact page with a supplier-grade "Procurement Desk" experience: contact details, social links, and a working enquiry form that emails submissions to `info@teavision.com.au` via Resend.

---

## Routing

Create `app/(storefront)/pages/contact/page.tsx`. Next.js resolves static segments before dynamic catch-alls, so this file automatically takes priority over `app/(storefront)/pages/[slug]/page.tsx` — no extra config needed.

---

## Layout

Supplier-first page with a warm hero, real tea imagery, and a form-led two-column work area. The form column leads on desktop and mobile.

```
Desktop (lg+)
┌────────────────────────────────────────────────┐
│  Let’s talk supply       [loose leaf image]     │
│  Wholesale, custom blends, private label        │
└────────────────────────────────────────────────┘

┌──────────────────────────┬─────────────────────┐
│  Start an enquiry        │  Direct lines       │
│  Name         Phone      │  Phone              │
│  Email                   │  Email              │
│  Message                 │  Address            │
│  [Send enquiry]          │  Supply notes       │
│                          │  [YT][IG][FB][WA]   │
└──────────────────────────┴─────────────────────┘

Mobile (< lg): form full-width, info block below
```

Hero grid: `lg:grid-cols-[1fr_0.9fr]` with `gap-10`.

Form grid: `lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]` with `gap-8`.

---

## Architecture

### New files

| File                                          | Purpose                                                              |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `app/(storefront)/pages/contact/page.tsx`     | Server Component page — metadata, layout, breadcrumb                 |
| `components/contact/contact-form.tsx`         | `'use client'` — controlled form, useTransition, success/error state |
| `components/contact/contact-form.stories.tsx` | Storybook story (default + success + error states)                   |
| `components/contact/index.ts`                 | Barrel export                                                        |
| `lib/contact/actions.ts`                      | `'use server'` Server Action — validates input, sends via Resend     |

### Modified files

| File                  | Change                                                     |
| --------------------- | ---------------------------------------------------------- |
| `docs/conventions.md` | Add `components/contact/` and `lib/contact/` to folder map |

### Scaffolding note

`pnpm create:component` and `pnpm create:lib` only work after the target domain directory exists. Implementation order:

1. Update `docs/conventions.md` to register `components/contact/` and `lib/contact/`.
2. Create `components/contact/` and `lib/contact/`.
3. Scaffold `pnpm create:component contact/contact-form` and `pnpm create:lib contact/actions`, or create the files manually if the scaffold output needs substantial changes.

---

## Page component (`page.tsx`)

Server Component. Renders:

1. `export const metadata: Metadata = ...` — title `"Contact | Teavision"`, description, canonical `/pages/contact`
2. Breadcrumb nav: `Home › Contact`
3. Procurement Desk hero: supplier copy, wholesale/private-label cues, tea image
4. Two-column grid: `<ContactForm />` left, direct lines and supply notes right

The contact info block is static JSX (not fetched from Shopify) — phone, email, address as icon rows, then supply notes and social links.

---

## ContactForm component

`'use client'`. Receives an `action` prop from the page and uses `useTransition` to call it. Manages three UI states:

- **idle** — form fields visible, submit enabled
- **pending** — submit button shows loading state (`isLoading` prop on `Button`)
- **success** — form replaced with a thank-you message: _"Thanks for your message. We'll be in touch shortly."_
- **error** — error banner above the submit button; form stays editable so the user can retry

Fields:
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | `text` | Yes | — |
| Phone | `tel` | No | Paired with Name in a 2-col sub-grid |
| Email | `email` | Yes | Full-width |
| Message | `textarea` | Yes | `rows={5}` |
| Website | `text` | No | Honeypot field, visually hidden with `tabIndex={-1}` and `autoComplete="off"` |

Uses `cn()` for all conditional className composition. Uses `<Button>` from `@/components/ui`. Labels use the same uppercase tracking style as the rest of the design system.

For Storybook, expose a small mockable seam instead of calling the real Server Action in stories:

```ts
type ContactActionResult = { success: boolean; error?: string }

type ContactFormProps = {
  action: (formData: FormData) => Promise<ContactActionResult>
  initialState?: 'idle' | 'success' | 'error'
  initialError?: string
}
```

The page passes `sendContactAction`. Storybook stories pass mock actions and `initialState` / `initialError` to render idle, success, and error states deterministically.

---

## Server Action (`lib/contact/actions.ts`)

```ts
'use server'

export async function sendContactAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }>
```

**Validation (server-side):**

- Name: non-empty, max 100 chars
- Email: non-empty, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 254 chars
- Message: non-empty, max 2000 chars
- Phone: optional, max 20 chars
- Website honeypot: optional, must be empty

Returns `{ success: false, error: 'Please fill in all required fields.' }` on validation failure — no field-level errors, just a single message (matches the form's simplicity).

If the honeypot field contains a value, return `{ success: true }` without sending email. This avoids confirming to bots that the submission was blocked.

**Email via Resend:**

- `from`: `"Teavision Contact <noreply@teavision.com.au>"` — requires domain verified in Resend
- `to`: `"info@teavision.com.au"`
- `subject`: `"New enquiry from [Name]"`
- `text`: plain-text body with all fields
- `replyTo`: the submitter's email address

If `RESEND_API_KEY` is absent (local dev without credentials), log the submission to console and return `{ success: true }` so the form is testable without an API key.

Wrap the Resend call in `try` / `catch`. On Resend errors, log the error server-side and return `{ success: false, error: 'Unable to send your message right now. Please try again shortly.' }` so the client shows the retryable error state instead of surfacing an unhandled Server Action failure.

---

## Environment variable

```
RESEND_API_KEY=re_...
```

Add to `.env.example` with a comment explaining the Resend domain verification requirement.

---

## Contact info (static constants)

Hard-coded in the page component — these are stable business details, not Shopify data:

```ts
const PHONE = '1300 729 617'
const EMAIL = 'info@teavision.com.au'
const ADDRESS = '29 Palladium Circuit, Clyde North VIC 3978'
```

Social links — add as constants once URLs are confirmed from the Shopify admin theme settings (currently stored as image block URLs not exported to the repo):

```ts
const SOCIAL_LINKS = [
  { label: 'YouTube', href: 'https://www.youtube.com/@teavision' },
  { label: 'Instagram', href: 'https://www.instagram.com/teavision/' },
  { label: 'Facebook', href: 'https://www.facebook.com/teavision/' },
  { label: 'WhatsApp', href: 'https://wa.me/611300729617' },
]
```

Rendered as `<a>` elements with small inline SVG icons (no icon library — consistent with `star-rating.tsx` approach), `aria-label` on each link, `target="_blank" rel="noopener noreferrer"`.

---

## Dependencies

- `resend` npm package — install with `pnpm add resend`

---

## Out of scope

- Google Maps embed (not shown on the live page by default)
- reCAPTCHA or third-party spam protection beyond the launch honeypot (can be added post-launch)
- File attachments
- Field-level validation error messages

---

## Storybook

`contact-form.stories.tsx` exports three stories:

- `Default` — idle state
- `Success` — pass `initialState="success"` so the form is replaced with thank-you
- `Error` — pass `initialState="error"` and `initialError="Unable to send your message right now. Please try again shortly."`

Stories must pass mock `action` functions and must not call the real Resend-backed Server Action.
