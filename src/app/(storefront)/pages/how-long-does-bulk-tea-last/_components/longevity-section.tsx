import { Eyebrow, Section } from '@/components/ui'

import { LONGEVITY } from '../_lib/data'

export function LongevitySection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start lg:gap-16">
          <div className="max-w-prose lg:col-span-2">
            <Eyebrow>{LONGEVITY.eyebrow}</Eyebrow>
            <h2 className="type-heading-02 text-ink mt-4 text-balance">
              {LONGEVITY.title}
            </h2>
            <div className="type-body-lg text-ink-soft mt-6 space-y-4">
              {LONGEVITY.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="bg-brand-tint rounded-xl p-7 lg:mt-1">
            <span className="type-eyebrow text-brand">{LONGEVITY.statLabel}</span>
            <p className="text-brand-deep mt-4 font-mono text-[2.75rem] leading-none md:text-[3.25rem]">
              {LONGEVITY.statValue}
            </p>
            <p className="type-label text-ink mt-3">{LONGEVITY.statUnit}</p>
            <p className="type-body-sm text-ink-soft mt-1">{LONGEVITY.statNote}</p>
          </aside>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
