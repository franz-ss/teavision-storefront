# Contact Page — Design Spec

**Date:** 2026-05-01
**Status:** Approved

---

## Goal

Deliver a `/pages/contact` route that replicates the live Teavision contact page: contact details, social links, and a working enquiry form that emails submissions to `info@teavision.com.au` via Resend.

---

## Routing

Create `app/(storefront)/pages/contact/page.tsx`. Next.js resolves static segments before dynamic catch-alls, so this file automatically takes priority over `app/(storefront)/pages/[slug]/page.tsx` — no extra config needed.

---

## Layout

Two-column on desktop (lg+), single-column stack on mobile. Form column leads on both breakpoints.

```
Desktop (lg+)
┌──────────────────────────┬────────────────────┐
│  Send us a message       │  Contact details   │
│  ─────────────────────   │  Phone             │
│  Name         Phone      │  Email             │
│  Email                   │  Address           │
│  Message                 │  ─────────────     │
│  [Send Message]          │  Follow us         │
│                          │  [YT][IG][FB][WA]  │
└──────────────────────────┴────────────────────┘

Mobile (< lg): form full-width, info block below
```

Grid: `lg:grid-cols-[1.4fr_1fr]` with `gap-8`.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `app/(storefront)/pages/contact/page.tsx` | Server Component page — metadata, layout, breadcrumb |
| `components/contact/contact-form.tsx` | `'use client'` — controlled form, useTransition, success/error state |
| `components/contact/contact-form.stories.tsx` | Storybook story (default + success + error states) |
| `components/contact/index.ts` | Barrel export |
| `lib/contact/actions.ts` | `'use server'` Server Action — validates input, sends via Resend |

### Modified files

| File | Change |
|---|---|
| `docs/conventions.md` | Add `components/contact/` and `lib/contact/` to folder map |

---

## Page component (`page.tsx`)

Server Component. Renders:
1. `<Metadata>` — title `"Contact | Teavision"`, description, canonical `/pages/contact`
2. Breadcrumb nav: `Home › Contact`
3. Page heading + tagline
4. Two-column grid: `<ContactForm />` left, contact info block right

The contact info block is static JSX (not fetched from Shopify) — phone, email, address as icon rows, then social links.

---

## ContactForm component

`'use client'`. Uses `useTransition` to call `sendContactAction`. Manages three UI states:

- **idle** — form fields visible, submit enabled
- **pending** — submit button shows loading state (`isLoading` prop on `Button`)
- **success** — form replaced with a thank-you message: *"Thanks for your message. We'll be in touch shortly."*
- **error** — error banner above the submit button; form stays editable so the user can retry

Fields:
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | `text` | Yes | — |
| Phone | `tel` | No | Paired with Name in a 2-col sub-grid |
| Email | `email` | Yes | Full-width |
| Message | `textarea` | Yes | `rows={5}` |

Uses `cn()` for all conditional className composition. Uses `<Button>` from `@/components/ui`. Labels use the same uppercase tracking style as the rest of the design system.

---

## Server Action (`lib/contact/actions.ts`)

```ts
'use server'

export async function sendContactAction(formData: FormData): Promise<{ success: boolean; error?: string }>
```

**Validation (server-side):**
- Name: non-empty, max 100 chars
- Email: non-empty, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 254 chars
- Message: non-empty, max 2000 chars
- Phone: optional, max 20 chars

Returns `{ success: false, error: 'Please fill in all required fields.' }` on validation failure — no field-level errors, just a single message (matches the form's simplicity).

**Email via Resend:**
- `from`: `"Teavision Contact <noreply@teavision.com.au>"` — requires domain verified in Resend
- `to`: `"info@teavision.com.au"`
- `subject`: `"New enquiry from [Name]"`
- `text`: plain-text body with all fields
- `replyTo`: the submitter's email address

If `RESEND_API_KEY` is absent (local dev without credentials), log the submission to console and return `{ success: true }` so the form is testable without an API key.

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
  { label: 'YouTube',   href: 'https://www.youtube.com/@teavision' },
  { label: 'Instagram', href: 'https://www.instagram.com/teavision/' },
  { label: 'Facebook',  href: 'https://www.facebook.com/teavision/' },
  { label: 'WhatsApp',  href: 'https://wa.me/611300729617' },
]
```

Rendered as `<a>` elements with small inline SVG icons (no icon library — consistent with `star-rating.tsx` approach), `aria-label` on each link, `target="_blank" rel="noopener noreferrer"`.

---

## Dependencies

- `resend` npm package — install with `pnpm add resend`

---

## Out of scope

- Google Maps embed (not shown on the live page by default)
- reCAPTCHA / spam protection (can be added post-launch)
- File attachments
- Field-level validation error messages

---

## Storybook

`contact-form.stories.tsx` exports three stories:
- `Default` — idle state
- `Success` — success state (form replaced with thank-you)
- `Error` — error banner visible
