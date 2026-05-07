import Link from 'next/link'

import { Button, Section } from '@/components/ui'
import { sendNewsletterSignupAction } from '@/lib/contact/actions'

type FooterLink = {
  href: string
  label: string
}

type FooterLinkSection = {
  title: string
  links: FooterLink[]
}

const FOOTER_LINK_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { href: '/collections/wholesale-bulk-tea', label: 'Wholesale Bulk' },
      { href: '/collections/speciality-tea', label: 'Speciality Blends' },
      { href: '/collections/bulk-tea-bags', label: 'Tea Bags' },
      { href: '/collections/australian-grown-tea', label: 'Australian Grown' },
      { href: '/collections/organic-tea', label: 'Organic' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/collections/custom-tea-blend', label: 'Custom Blends' },
      { href: '/pages/services', label: 'Private Label' },
      { href: '/collections/bulk-tea-bags', label: 'Tea Bag Manufacturing' },
      { href: '/pages/services', label: 'New Product Development' },
    ],
  },
  {
    title: 'Wholesale',
    links: [
      { href: '/pages/wholesale', label: 'Account Request' },
      { href: '/pages/download-catalogues', label: 'Catalogues' },
      { href: '/pages/how-to-store-bulk-tea', label: 'Bulk Storage Guide' },
      { href: '/pages/contact', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/pages/our-story', label: 'Our Story' },
      { href: '/pages/terms-conditions-1', label: 'Certifications' },
      { href: '/blogs/teavision-blogs', label: 'Tea Journal' },
      { href: '/pages/contact', label: 'Contact' },
    ],
  },
] satisfies FooterLinkSection[]

const LEGAL_LINKS = [
  { href: '/pages/gdpr-compliance', label: 'Privacy' },
  { href: '/pages/terms-of-service', label: 'Terms' },
  { href: '/pages/terms-conditions-1', label: 'Compliance' },
  { href: '/search', label: 'Popular searches' },
] satisfies FooterLink[]

const FOOTER_LINK_CLASS =
  'focus-visible:ring-ring focus-visible:ring-offset-brand inline-flex min-h-10 items-center text-on-brand/85 transition-colors hover:text-on-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

async function subscribeToNewsletter(formData: FormData) {
  'use server'

  await sendNewsletterSignupAction(formData)
}

function FooterTextLink({ href, label }: FooterLink) {
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={FOOTER_LINK_CLASS}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={FOOTER_LINK_CLASS}>
      {label}
    </Link>
  )
}

function FooterLinkList({ title, links }: FooterLinkSection) {
  return (
    <div>
      <h3 className="type-eyebrow text-on-brand/75 mb-3 uppercase">{title}</h3>
      <ul className="type-body-sm flex flex-col gap-2" role="list">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <FooterTextLink href={link.href} label={link.label} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-brand text-on-brand">
      <div className="max-w-wide mx-auto px-4 pt-16 pb-8 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Section.Root
            tone="transparent"
            spacing="none"
            aria-labelledby="footer-newsletter-heading"
          >
            <h2
              id="footer-newsletter-heading"
              className="type-eyebrow text-on-brand/75 uppercase"
            >
              Tea Journal in your inbox
            </h2>
            <p className="type-body-sm text-on-brand/85 mt-3 max-w-xs">
              Trade insights, harvest notes, and new ranges once a month. No
              noise.
            </p>
            <form
              action={subscribeToNewsletter}
              className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row"
            >
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@business.com.au"
                className="type-body-sm focus-visible:ring-ring border-on-brand/30 text-on-brand placeholder:text-on-brand/50 hover:border-on-brand/60 focus-visible:border-on-brand min-h-11 flex-1 rounded-md border bg-transparent px-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              />
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="footer-newsletter-website">Website</label>
                <input
                  id="footer-newsletter-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <Button type="submit" variant="inverse">
                Subscribe
              </Button>
            </form>
          </Section.Root>

          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 xl:grid-cols-4">
              {FOOTER_LINK_SECTIONS.map((section) => (
                <FooterLinkList
                  key={section.title}
                  title={section.title}
                  links={section.links}
                />
              ))}
            </div>
          </nav>
        </div>

        <div className="border-on-brand/15 text-on-brand/70 mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption">© 2026 Teavision Pty Ltd</p>
          <ul
            className="type-caption flex flex-wrap gap-x-6 gap-y-2"
            role="list"
          >
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <FooterTextLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
