import { Phone } from 'lucide-react'

import { Card, Eyebrow, Section } from '@/components/ui'
import { sendCustomTeaBlendFormAction } from '@/lib/contact/actions'

import { Form } from './form'

export function CtaSection() {
  return (
    <Section.Root
      id="blend-brief"
      tone="inverse"
      className="border-paper/10 scroll-mt-24 border-y"
    >
      <Section.Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(20rem,0.38fr)] lg:items-start">
          <div>
            <Eyebrow tone="gold">Custom blend brief</Eyebrow>
            <h2 className="type-heading-02 text-paper mt-3">
              Tell us about your custom tea.
            </h2>
            <p className="type-lede text-paper/80 mt-4 max-w-2xl">
              Share the flavour direction, product format, markets, price point,
              launch timing, or reference products. A short brief is enough to
              start the conversation.
            </p>
            <div className="border-paper/12 mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2">
              <div>
                <p className="type-mono-meta text-paper/60">Prefer a call?</p>
                <a
                  href="tel:1300729617"
                  className="type-heading-05 focus-visible:ring-ring text-paper hover:text-gold mt-2 inline-flex items-center gap-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  1300 729 617
                </a>
              </div>
              <div>
                <p className="type-mono-meta text-paper/60">Email direct</p>
                <a
                  href="mailto:info@teavision.com.au"
                  className="type-heading-05 focus-visible:ring-ring text-paper hover:text-gold mt-2 inline-flex hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  info@teavision.com.au
                </a>
              </div>
            </div>
          </div>

          <Card padding="lg" radius="lg">
            <Form action={sendCustomTeaBlendFormAction} />
          </Card>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
