import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, Section } from '@/components/ui'

const WHOLESALE_STATS = [
  { stat: '1,000+', label: 'Ingredients' },
  { stat: '500+', label: 'Certified Organic' },
  { stat: '15+', label: 'Countries sourced' },
  { stat: '15+', label: 'Industry awards' },
]

const WHOLESALE_INCLUSIONS = [
  'Trade pricing on commercial bulk orders',
  'Custom blending and private label pathways',
  'HACCP and ACO certified supply conversations',
  'Catalogue support, sample packs, and account guidance',
]

const WHOLESALE_PATHS = [
  {
    title: 'Custom blending',
    body: 'Develop signature blends with product development support and practical commercial guidance.',
    href: '/pages/custom-tea-blends',
  },
  {
    title: 'Private label',
    body: 'Package tea, herbs, spices, and functional blends under your own brand.',
    href: '/pages/private-label-packing',
  },
  {
    title: 'Bulk supply',
    body: 'Plan larger orders, imports, and repeat supply with a team built for scale.',
    href: '/pages/bulk-wholesale-supply',
  },
]

export const metadata: Metadata = {
  title: 'Wholesale Accounts | Teavision',
  description:
    'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers across Australia.',
  openGraph: {
    title: 'Wholesale Accounts | Teavision',
    description:
      'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers.',
    url: '/pages/wholesale',
  },
  alternates: { canonical: '/pages/wholesale' },
}

export default function WholesalePage() {
  return (
    <>
      <Section.Root tone="sunken" className="border-default border-b">
        <Section.Container>
          <nav className="type-body-sm text-muted mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2" role="list">
              <li>
                <Link
                  href="/"
                  className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-default" aria-current="page">
                Wholesale
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(18rem,0.28fr)] lg:items-end">
            <div>
              <p className="type-eyebrow text-muted">Wholesale accounts</p>
              <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
                Bulk tea, herbs, and spices for serious buyers.
              </h1>
              <p className="type-body-lg text-muted mt-6 max-w-prose">
                Access Teavision&rsquo;s ingredient range, certified supply
                pathways, and commercial guidance for cafes, restaurants,
                retailers, and wellness brands across Australia.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/pages/contact"
                  className="type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Apply for wholesale
                </Link>
                <Link
                  href="/collections/all"
                  className="type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md border px-5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Browse ingredients
                </Link>
              </div>
            </div>

            <dl className="border-default bg-surface grid grid-cols-2 gap-px overflow-hidden rounded-lg border">
              {WHOLESALE_STATS.map(({ stat, label }) => (
                <div key={label} className="bg-surface p-4">
                  <dt className="type-caption text-muted">{label}</dt>
                  <dd className="type-heading-03 text-brand mt-2">{stat}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section.Container>
      </Section.Root>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(18rem,0.3fr)]">
          <Section.Root tone="transparent" spacing="none">
            <p className="type-eyebrow text-muted">Supply pathways</p>
            <h2 className="type-heading-02 text-strong mt-3">
              Start with the right commercial route.
            </h2>
            <ul
              className="mt-8 grid gap-4 md:grid-cols-3"
              role="list"
              aria-label="Wholesale service pathways"
            >
              {WHOLESALE_PATHS.map((path) => (
                <Card as="li" key={path.title} interactive className="h-full">
                  <Link
                    href={path.href}
                    className="focus-visible:ring-ring block h-full p-5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <h3 className="type-heading-04 text-strong">
                      {path.title}
                    </h3>
                    <p className="type-body-sm text-muted mt-3">{path.body}</p>
                  </Link>
                </Card>
              ))}
            </ul>
          </Section.Root>

          <aside className="border-default border-y py-6">
            <p className="type-eyebrow text-muted">What&rsquo;s included</p>
            <ul className="mt-5 grid gap-4" role="list">
              {WHOLESALE_INCLUSIONS.map((item) => (
                <li key={item} className="type-body-sm flex gap-3">
                  <span
                    className="bg-brand mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="border-default mt-8 border-t pt-6">
              <p className="type-eyebrow text-muted">Direct contact</p>
              <dl className="mt-4 grid gap-4">
                <div>
                  <dt className="type-caption text-muted">Phone</dt>
                  <dd className="type-label mt-1">
                    <a
                      href="tel:1300729617"
                      className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      1300 729 617
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="type-caption text-muted">Email</dt>
                  <dd className="type-label mt-1">
                    <a
                      href="mailto:wholesale@teavision.com.au"
                      className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      wholesale@teavision.com.au
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
