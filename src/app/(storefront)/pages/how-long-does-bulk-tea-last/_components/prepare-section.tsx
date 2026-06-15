import { Eyebrow, Section } from '@/components/ui'

import { PREPARE } from '../_lib/data'

export function PrepareSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="max-w-prose">
          <Eyebrow>{PREPARE.eyebrow}</Eyebrow>
          <h2 className="type-heading-02 text-ink mt-4 text-balance">
            {PREPARE.title}
          </h2>
          <div className="type-body-lg text-ink-soft mt-6 space-y-4">
            {PREPARE.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
