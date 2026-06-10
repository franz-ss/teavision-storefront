import Image from 'next/image'

import { Button, Eyebrow, Section } from '@/components/ui'

import { HOMEPAGE_HERO } from '../content'

export function HomepageHero() {
  return (
    <Section.Root
      tone="transparent"
      spacing="none"
      className="relative isolate overflow-hidden"
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
      <div
        aria-hidden="true"
        className="hero-scrim absolute inset-0 -z-10"
      />
      <Section.Container className="flex h-full min-h-[inherit] flex-col justify-end pb-16 pt-32">
        <Eyebrow tone="gold" className="mb-6">
          Australia&apos;s tea, herb &amp; spice house
        </Eyebrow>
        <h1 className="type-display max-w-[16ch] text-paper">
          {HOMEPAGE_HERO.title}
        </h1>
        <p className="type-lede mt-6 max-w-[48ch] text-paper/90">
          {HOMEPAGE_HERO.copy}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={HOMEPAGE_HERO.cta.href} variant="inverse" size="lg">
            {HOMEPAGE_HERO.cta.children}
          </Button>
          <Button
            href="/pages/wholesale"
            variant="inverseSecondary"
            size="lg"
          >
            Open a wholesale account
          </Button>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
