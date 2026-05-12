import { Section } from '@/components/ui'

import { PRODUCT_RANGE } from '../content'
import { OverlayImageCard } from '../overlay-image-card'

export function ProductRange() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <Section.Intro
          title="Explore Our Product Range"
          copy="We offer Wholesale products online direct to consumers and businesses or you can apply for a bulk wholesale account and receive further discounts on 100kg+ orders."
        />
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRODUCT_RANGE.map((card) => (
            <li key={card.href}>
              <OverlayImageCard card={card} />
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
