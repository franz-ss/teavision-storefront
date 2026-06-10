import { Eyebrow, Section } from '@/components/ui'

import { PRODUCT_RANGE } from '../content'
import { OverlayImageCard } from '../overlay-image-card'

export function ProductRange() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        {/* Split section head: Eyebrow + heading left, description right */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow className="mb-4">Explore the range</Eyebrow>
            <h2 className="type-heading-01">
              Wholesale online, direct
              <br />
              to business or doorstep.
            </h2>
          </div>
          <p className="text-ink-soft max-w-[34ch] lg:text-right">
            Buy any line online at wholesale prices — or apply for a bulk
            account and unlock further discounts on 100kg+ orders.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_RANGE.map((card) => (
            <li key={card.href} className="rounded-lg overflow-hidden">
              <OverlayImageCard card={card} />
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
