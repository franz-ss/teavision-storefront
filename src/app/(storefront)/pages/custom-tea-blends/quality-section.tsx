import { Card, Section } from '@/components/ui'

import { QUALITY_CARDS, type QualityCard } from './custom-tea-blends-data'

function QualityFeatureCard({ card }: { card: QualityCard }) {
  return (
    <Card as="article" padding="md" className="h-full">
      <h3 className="type-heading-05 text-strong">{card.title}</h3>
      <p className="type-body-sm text-muted mt-3">{card.description}</p>
    </Card>
  )
}

export function QualitySection() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <div className="max-w-3xl">
          <p className="type-eyebrow text-muted">Quality assured</p>
          <h2 className="type-heading-02 text-strong mt-3">
            Naturopath-guided and commercially grounded.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {QUALITY_CARDS.map((card) => (
            <QualityFeatureCard key={card.title} card={card} />
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
