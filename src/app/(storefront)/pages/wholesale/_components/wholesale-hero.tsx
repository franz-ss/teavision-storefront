import Link from 'next/link'

import { Section } from '@/components/ui'

import { WholesaleStats } from './wholesale-stats'

export function WholesaleHero() {
  return (
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

          <WholesaleStats />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
