import Image from 'next/image'

import {
  Button,
  ButtonProps,
  Eyebrow,
  Section,
  type SectionIntroProps,
  type SectionRootProps,
} from '@/components/ui'

export interface CtaProps {
  tone?: SectionRootProps['tone']
  intro: SectionIntroProps
  cta: ButtonProps
}

export function Cta({ tone, intro, cta }: CtaProps) {
  return (
    <Section.Root tone={tone ?? 'brand'} className="overflow-hidden">
      <Section.Container>
        {/* Narrow motif tracks + negative margins (same as the other motif bands):
            images bleed past the content edge, the copy column gets wider */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,160px)]">
          <div className="flex justify-center lg:order-0 lg:-ml-18">
            {/* Original-site cup-in-hands illustration (owner-supplied asset) */}
            <Image
              src="/images/catalogue-cup.png"
              alt=""
              aria-hidden="true"
              width={680}
              height={567}
              className="animate-bc-float h-auto w-[clamp(184px,23vw,248px)] max-w-none object-contain motion-reduce:animate-none"
              sizes="(min-width: 1024px) 248px, 40vw"
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">
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

          <div className="flex justify-center lg:order-0 lg:-mr-20">
            {/* Plain brush ring — no text overlay (owner: curved text overlapped) */}
            <Image
              src="/images/catalogue-stamp.png"
              alt=""
              aria-hidden="true"
              width={562}
              height={567}
              className="animate-st-float h-auto w-[clamp(140px,14vw,200px)] max-w-none object-contain motion-reduce:animate-none"
              sizes="(min-width: 1024px) 200px, 30vw"
            />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
