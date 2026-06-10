import { Section } from '@/components/ui'

import { FEATURE_CARDS_3 } from '../_lib/data'

export function FeaturesGrid3() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURE_CARDS_3.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-hairline bg-paper p-6"
            >
              <h3 className="type-label text-ink font-semibold">{card.title}</h3>
              <p className="type-body-sm text-ink-soft mt-2">{card.description}</p>
            </div>
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
