import Link from 'next/link'

import { Button, Section } from '@/components/ui'

import { CERTIFICATION_COVERAGE } from '../content'

export function CertificationCoverage() {
  return (
    <Section.Root tone="surface">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="type-eyebrow text-muted">Quality systems</p>
          <h2 className="type-heading-02 text-strong mt-3">
            Certification coverage built for wholesale decisions.
          </h2>
          <p className="type-body text-muted mt-5 max-w-prose">
            Buyers need proof before they need poetry. Surface the standards,
            sourcing reach, and operational support that make Teavision a
            dependable supply partner for scaled tea, herb, and spice programs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/pages/wholesale" size="cta">
              Request wholesale access
            </Button>
            <Link
              href="/pages/download-catalogues"
              className="type-label text-brand hover:text-link-hover focus-visible:ring-ring inline-flex min-h-12 items-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Review catalogues
            </Link>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {CERTIFICATION_COVERAGE.map((card) => (
            <li
              key={card.title}
              className="border-default bg-surface-sunken rounded-md border p-5"
            >
              <p className="type-eyebrow text-accent">{card.eyebrow}</p>
              <h3 className="type-heading-05 text-strong mt-3">{card.title}</h3>
              <p className="type-body-sm text-muted mt-3">{card.description}</p>
              <ul className="mt-5 grid gap-2">
                {card.details.map((detail) => (
                  <li
                    key={detail}
                    className="type-body-sm text-default flex gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-brand mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
