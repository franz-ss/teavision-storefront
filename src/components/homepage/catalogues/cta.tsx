import {
  Button,
  ButtonProps,
  Eyebrow,
  Section,
  type SectionIntroProps,
  type SectionRootProps,
} from '@/components/ui'

import { BrushCircle } from '../brush-circle'
import { Stamp } from '../stamp'

export interface CtaProps {
  tone?: SectionRootProps['tone']
  intro: SectionIntroProps
  cta: ButtonProps
}

export function Cta({ tone, intro, cta }: CtaProps) {
  return (
    <Section.Root tone={tone ?? 'brand'} className="overflow-hidden">
      <Section.Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,210px)_1fr_minmax(0,260px)]">
          <div className="flex justify-center lg:order-0">
            <Stamp top="Catalog" bottom="Teavision" tone="brand" />
          </div>

          <div className="mx-auto max-w-[52ch] text-center">
            {intro.eyebrow ? (
              <Eyebrow tone="gold" className="mb-4 justify-center">
                {intro.eyebrow}
              </Eyebrow>
            ) : null}
            <h2 className="type-heading-01 text-paper">{intro.title}</h2>
            {intro.copy ? (
              <p className="type-lede text-paper/75 mt-4">{intro.copy}</p>
            ) : null}

            {cta ? (
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button {...cta} variant="inverse" size="cta" />
                <Button
                  href="/collections"
                  variant="inverseSecondary"
                  size="cta"
                >
                  Browse online
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center lg:order-0">
            <BrushCircle illo="cup" />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
