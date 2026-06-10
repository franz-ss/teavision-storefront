import Image from 'next/image'
import {
  ArrowRight,
  FlaskConical,
  Medal,
  Truck,
  type LucideIcon,
} from 'lucide-react'

import { Button, Eyebrow, Section } from '@/components/ui'

import { HOMEPAGE_HERO, HOMEPAGE_PROOF_POINTS } from '../content'

const STRIP_ICON_MAP: Record<string, LucideIcon> = {
  FlaskConical,
  Medal,
  Truck,
}

export function HomepageHero() {
  return (
    <Section.Root
      tone="transparent"
      spacing="none"
      className="relative isolate flex flex-col overflow-hidden"
      style={{ minHeight: 'min(92vh, 860px)' }}
    >
      <Image
        src={HOMEPAGE_HERO.image.src}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      {/* Inner content: mt-auto + block padding per design .heroA__inner —
          text sits above the trust strip, not flush to the hero bottom */}
      <Section.Container className="mt-auto w-full py-[clamp(60px,9vw,110px)]">
        <Eyebrow tone="gold" className="mb-6.5">
          Australia&apos;s tea, herb &amp; spice house
        </Eyebrow>
        <h1 className="type-display text-paper max-w-[16ch]">
          {HOMEPAGE_HERO.title}
        </h1>
        <p className="type-lede text-paper/90 mt-6 max-w-[48ch]">
          {HOMEPAGE_HERO.copy}
        </p>
        <div className="mt-8.5 flex flex-wrap gap-3">
          <Button href={HOMEPAGE_HERO.cta.href} variant="inverse" size="lg">
            {HOMEPAGE_HERO.cta.children}
            <ArrowRight
              aria-hidden="true"
              className="size-4.5"
              strokeWidth={1.8}
            />
          </Button>
          <Button href="/pages/wholesale" variant="inverseSecondary" size="lg">
            Open a wholesale account
          </Button>
        </div>
      </Section.Container>

      {/* Trust strip at the hero foot per design .heroA__strip —
          dark translucent band keeps the stats legible over any hero photo */}
      <div className="border-paper/18 bg-ink/40 border-t">
        <Section.Container>
          <ul className="grid grid-cols-2 lg:grid-cols-4" role="list">
            {HOMEPAGE_PROOF_POINTS.map((point, index) => {
              const IconComponent = point.icon
                ? STRIP_ICON_MAP[point.icon]
                : undefined
              const isLastInRow2 = index % 2 === 1
              const isLastOverall = index === HOMEPAGE_PROOF_POINTS.length - 1
              return (
                <li
                  key={point.title}
                  className={
                    isLastOverall
                      ? 'px-6 py-5.5'
                      : isLastInRow2
                        ? 'lg:border-paper/14 border-r-0 px-6 py-5.5 lg:border-r'
                        : 'border-paper/14 border-r px-6 py-5.5'
                  }
                >
                  <div className="font-display text-paper flex items-center gap-2 text-[1.7rem] leading-none">
                    {point.image ? (
                      <Image
                        src={point.image.src}
                        alt={point.image.alt}
                        width={22}
                        height={11}
                        className="h-auto w-5.5"
                      />
                    ) : IconComponent ? (
                      <IconComponent
                        aria-hidden="true"
                        className="text-gold size-5.5"
                        strokeWidth={1.8}
                      />
                    ) : null}
                    {point.title}
                  </div>
                  <div className="text-paper/70 mt-1 text-[0.82rem]">
                    {point.description}
                  </div>
                </li>
              )
            })}
          </ul>
        </Section.Container>
      </div>
    </Section.Root>
  )
}
