import { Phone } from 'lucide-react'

import { Card, Section } from '@/components/ui'
import { sendCustomTeaBlendFormAction } from '@/lib/contact/actions'

import { Form } from './form'

export function CtaSection() {
  return (
    <Section.Root
      id="blend-brief"
      tone="sunken"
      className="border-default scroll-mt-24 border-y"
    >
      <Section.Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(20rem,0.38fr)] lg:items-start">
          <div>
            <p className="type-eyebrow text-muted">Custom blend brief</p>
            <h2 className="type-heading-02 text-strong mt-3">
              Tell us about your custom tea.
            </h2>
            <p className="type-body-lg text-muted mt-4 max-w-2xl">
              Share the flavour direction, product format, markets, price point,
              launch timing, or reference products. A short brief is enough to
              start the conversation.
            </p>
            <div className="border-default mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2">
              <div>
                <p className="type-eyebrow text-muted">Prefer a call?</p>
                <a
                  href="tel:1300729617"
                  className="type-heading-05 text-link hover:text-link-hover focus-visible:ring-ring mt-2 inline-flex items-center gap-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  1300 729 617
                </a>
              </div>
              <div>
                <p className="type-eyebrow text-muted">Email direct</p>
                <a
                  href="mailto:info@teavision.com.au"
                  className="type-heading-05 text-link hover:text-link-hover focus-visible:ring-ring mt-2 inline-flex hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  info@teavision.com.au
                </a>
              </div>
            </div>
          </div>

          <Card padding="lg">
            <Form action={sendCustomTeaBlendFormAction} />
          </Card>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
