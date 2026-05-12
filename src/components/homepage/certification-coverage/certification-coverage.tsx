import { Check } from 'lucide-react'

import { Section } from '@/components/ui'

import { CERTIFICATION_COVERAGE } from '../content'

export function CertificationCoverage() {
  return (
    <Section.Root tone="surface">
      <Section.Container className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="type-heading-02 text-strong mt-3">
            Certification Coverage
          </h2>
          <p className="type-body text-muted mx-auto mt-5 max-w-prose">
            Our comprehensive certification portfolio ensures quality, safety,
            and compliance across every aspect of our tea manufacturing
            operation
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CERTIFICATION_COVERAGE.map((card) => (
            <li
              key={card.title}
              className="border-default bg-surface-sunken rounded-md border p-5"
            >
              <p className="type-eyebrow text-accent">{card.eyebrow}</p>
              <h3 className="type-heading-05 text-strong mt-3">{card.title}</h3>
              <p className="type-body-sm text-muted mt-3 line-clamp-5">
                {card.description}
              </p>
              <ul className="mt-5 grid gap-2">
                {card.details.map((detail) => (
                  <li
                    key={detail}
                    className="type-body-sm text-default flex items-center gap-3"
                  >
                    <Check
                      aria-hidden="true"
                      className="text-brand h-4 w-4 shrink-0"
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
