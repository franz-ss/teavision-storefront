import { Card, Section } from '@/components/ui'

import {
  CAPABILITY_CARDS,
  type CustomTeaBlendCard,
} from './custom-tea-blends-data'
import { BlendImage } from './blend-image'

function BlendDetailCard({ card }: { card: CustomTeaBlendCard }) {
  return (
    <Card as="article" overflow="hidden" className="h-full">
      <div className="aspect-4/3">
        <BlendImage
          image={card.image}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="p-5">
        <h3 className="type-heading-05 text-strong">{card.title}</h3>
        <p className="type-body-sm text-muted mt-3">{card.description}</p>
      </div>
    </Card>
  )
}

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
