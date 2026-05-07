import { Section } from '@/components/ui'

import { SERVICE_CARDS } from '../content'
import { OverlayImageCard } from '../overlay-image-card'

export function PrivateLabel() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <Section.Intro
          title="Private Label & Custom Tea Solutions"
          copy="We partner with you to develop custom blends, manufacture tea bags, and deliver fully packaged private label tea products."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {SERVICE_CARDS.map((card) => (
            <li key={card.title}>
              <OverlayImageCard card={card} />
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
