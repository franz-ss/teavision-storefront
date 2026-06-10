import { Button, Eyebrow, Section } from '@/components/ui'

import { BrushCircle } from '../brush-circle'
import { Stamp } from '../stamp'

export function SupplyChain() {
  return (
    <Section.Root tone="inverse" className="overflow-hidden">
      <Section.Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,210px)]">
          <div className="flex justify-center">
            <BrushCircle illo="handshake" />
          </div>

          <div className="mx-auto max-w-[52ch] text-center">
            <Eyebrow tone="gold" className="mb-4 justify-center">
              For business
            </Eyebrow>
            <h2 className="type-heading-01 text-paper">
              Let the experts help{' '}
              <em className="italic text-gold">grow</em> your business.
            </h2>
            <p className="type-lede mt-4 text-paper/75">
              We take pride in everything we do, sourcing the best ingredients
              at the best prices so our certified tea masters and herbalists
              can help your business reach its next goal.
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/pages/contact" variant="inverse" size="cta">
                Contact the team
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Stamp top="Business" bottom="Teavision" />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
