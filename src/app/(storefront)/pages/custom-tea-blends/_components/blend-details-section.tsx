import { Section } from '@/components/ui'

import { CAPABILITY_CARDS } from '../_lib/data'
import { BlendDetailCard } from './blend-detail-card'

export function BlendDetailsSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="max-w-3xl">
          <p className="type-eyebrow text-muted">Capabilities</p>
          <h2 className="type-heading-02 text-strong mt-3">
            Custom blends for every tea style.
          </h2>
          <p className="type-body-lg text-muted mt-4">
            From loose-leaf hero blends to pyramid tea bags and clean instant
            powders, Teavision tunes flavour, function, and format to your
            market.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITY_CARDS.map((card) => (
            <BlendDetailCard key={card.title} card={card} />
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
