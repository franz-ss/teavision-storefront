import { Eyebrow, Section } from '@/components/ui'

import { LONGEVITY } from '../_lib/data'

export function LongevitySection() {
  return (
    <Section.Root tone="surface" spacing="compact">
      <Section.Container variant="compact">
        <Eyebrow>{LONGEVITY.eyebrow}</Eyebrow>
        <h2 className="type-heading-02 text-ink mt-4 text-balance">
          {LONGEVITY.title}
        </h2>
        <div className="type-body-lg text-ink-soft mt-6 space-y-4">
          {LONGEVITY.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="bg-brand-tint mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl px-7 py-5">
          <p className="text-brand-deep font-mono text-[2.75rem] leading-none">
            {LONGEVITY.statValue}
          </p>
          <div>
            <p className="type-label text-ink">{LONGEVITY.statUnit}</p>
            <p className="type-body-sm text-ink-soft">
              {LONGEVITY.statLabel} · {LONGEVITY.statNote}
            </p>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
