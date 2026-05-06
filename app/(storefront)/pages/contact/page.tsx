import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ContactForm } from '@/components/contact'
import { sendContactAction } from '@/lib/contact/actions'

export const metadata: Metadata = {
  title: 'Contact | Teavision',
  description:
    'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries across Australia.',
  openGraph: {
    title: 'Contact | Teavision',
    description:
      'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries.',
    url: '/pages/contact',
  },
  alternates: { canonical: '/pages/contact' },
}

const PHONE = '1300 729 617'
const PHONE_HREF = 'tel:1300729617'
const EMAIL = 'info@teavision.com.au'
const EMAIL_HREF = 'mailto:info@teavision.com.au'
const ADDRESS = '29 Palladium Circuit, Clyde North VIC 3978'
const IMAGE_SRC =
  'https://images.pexels.com/photos/7303163/pexels-photo-7303163.jpeg?auto=compress&cs=tinysrgb&w=1200'

const SUPPLY_CUES = [
  'Wholesale account support',
  'Custom blending',
  'Private label supply',
]

const SUPPLY_NOTES = [
  'Bulk tea, herbs, spices, and botanicals',
  'Samples, quote requests, and ingredient availability',
  'HACCP and ACO certified supply conversations',
]

const CONTACT_METHODS = [
  {
    label: 'Phone',
    value: PHONE,
    href: PHONE_HREF,
    icon: 'phone',
  },
  {
    label: 'Email',
    value: EMAIL,
    href: EMAIL_HREF,
    icon: 'mail',
  },
  {
    label: 'Address',
    value: ADDRESS,
    href: 'https://www.google.com/maps/search/?api=1&query=29%20Palladium%20Circuit%2C%20Clyde%20North%20VIC%203978',
    icon: 'pin',
  },
] as const

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@teavision',
    icon: 'youtube',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/teavision/',
    icon: 'instagram',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/teavision/',
    icon: 'facebook',
  },
  { label: 'WhatsApp', href: 'https://wa.me/611300729617', icon: 'whatsapp' },
] as const

type IconName =
  | (typeof CONTACT_METHODS)[number]['icon']
  | (typeof SOCIAL_LINKS)[number]['icon']

function Icon({ name }: { name: IconName }) {
  const commonProps = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  }

  switch (name) {
    case 'phone':
      return (
        <svg {...commonProps}>
          <path
            d="M6.5 4.75 9 4l2 4-1.5 1.25c.75 1.5 2 2.75 3.5 3.5L14.25 11l4 2-.75 2.5c-.25.75-.75 1.25-1.5 1.25-5 0-9.75-4.75-9.75-9.75 0-.75.5-1.25 1.25-1.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'mail':
      return (
        <svg {...commonProps}>
          <path
            d="M4.75 6.75h14.5v10.5H4.75V6.75Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m5.25 7.25 6.75 5 6.75-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'pin':
      return (
        <svg {...commonProps}>
          <path
            d="M12 20.25s6-5.5 6-10.25a6 6 0 1 0-12 0c0 4.75 6 10.25 6 10.25Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 12.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...commonProps}>
          <path
            d="M4.5 8.5c.25-1.25 1-1.75 2.25-1.9C8 6.5 10 6.5 12 6.5s4 0 5.25.1c1.25.15 2 .65 2.25 1.9.15.8.25 1.9.25 3.5s-.1 2.7-.25 3.5c-.25 1.25-1 1.75-2.25 1.9-1.25.1-3.25.1-5.25.1s-4 0-5.25-.1c-1.25-.15-2-.65-2.25-1.9-.15-.8-.25-1.9-.25-3.5s.1-2.7.25-3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m10.5 9.75 4 2.25-4 2.25v-4.5Z" fill="currentColor" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...commonProps}>
          <path
            d="M8.5 4.75h7A3.75 3.75 0 0 1 19.25 8.5v7a3.75 3.75 0 0 1-3.75 3.75h-7a3.75 3.75 0 0 1-3.75-3.75v-7A3.75 3.75 0 0 1 8.5 4.75Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M16.4 7.6h.01" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...commonProps}>
          <path
            d="M14 8.25h2V5.5h-2.5c-2.25 0-3.5 1.35-3.5 3.6v1.65H8v2.75h2v5h3v-5h2.25l.5-2.75H13V9.1c0-.55.35-.85 1-.85Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...commonProps}>
          <path
            d="M5.5 19.25 6.4 16.5A7.25 7.25 0 1 1 9 18.8l-3.5.45Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.75 8.75c.35 2.6 1.9 4.15 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}

export default function ContactPage() {
  return (
    <>
      <section className="border-default bg-surface-sunken border-y">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-muted type-eyebrow">
              Teavision procurement desk
            </p>
            <h1 className="type-display-01 mt-5 max-w-3xl text-balance">
              Let&rsquo;s talk supply.
            </h1>
            <p className="text-muted type-body mt-6 max-w-2xl">
              Speak with the team behind wholesale tea, herbs, spices, custom
              blending, and private label supply for Australian food and
              beverage businesses.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3" role="list">
              {SUPPLY_CUES.map((cue) => (
                <li
                  key={cue}
                  className="type-label border-default bg-canvas rounded border px-3 py-2"
                >
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          <figure className="border-default bg-surface overflow-hidden rounded border">
            <Image
              src={IMAGE_SRC}
              alt="Loose leaf tea steeping in glassware, showing the ingredient texture Teavision supplies."
              width={1200}
              height={900}
              priority
              className="aspect-[4/3] h-full w-full object-cover"
            />
            <figcaption className="type-body-sm border-default bg-surface text-muted border-t px-4 py-3">
              Bulk ingredients, sample requests, and custom blend briefs start
              here.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <nav className="type-body-sm mb-8" aria-label="Breadcrumb">
          <ol className="text-muted flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-default hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-default" aria-current="page">
              Contact
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
          <section className="border-default bg-surface rounded border p-5 sm:p-8">
            <ContactForm action={sendContactAction} />
          </section>

          <aside className="border-default border-y py-6 lg:sticky lg:top-8">
            <div>
              <p className="text-muted type-eyebrow">Direct lines</p>
              <h2 className="type-heading-02 mt-3">Reach the team</h2>
            </div>

            <dl className="divide-border mt-6 divide-y">
              {CONTACT_METHODS.map((method) => (
                <div key={method.label} className="flex gap-4 py-5 first:pt-0">
                  <div className="border-default bg-surface text-brand mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded border">
                    <Icon name={method.icon} />
                  </div>
                  <div>
                    <dt className="text-muted type-eyebrow">{method.label}</dt>
                    <dd className="type-label text-default mt-1">
                      <a
                        href={method.href}
                        className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
                        target={
                          method.label === 'Address' ? '_blank' : undefined
                        }
                        rel={
                          method.label === 'Address'
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {method.value}
                      </a>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="border-default mt-8 border-t pt-6">
              <p className="text-muted type-eyebrow">Useful for</p>
              <ul className="mt-4 space-y-3" role="list">
                {SUPPLY_NOTES.map((note) => (
                  <li key={note} className="type-body-sm flex gap-3">
                    <span
                      className="bg-action-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-default mt-8 border-t pt-6">
              <p className="text-muted type-eyebrow">Follow us</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-default bg-surface text-brand hover:border-brand hover:bg-brand-subtle flex h-11 w-11 items-center justify-center rounded border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <Icon name={link.icon} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
