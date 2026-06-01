import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { HOMEPAGE_HERO } from '../content'

export function HomepageHero() {
  return (
    <Section.Root
      tone="brandStrong"
      className="relative isolate overflow-hidden"
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
        className="bg-inverse/50 absolute inset-0 -z-10"
      />
      <Section.Container>
        <div className="max-w-prose">
          <h1 className="type-heading-01 text-on-brand md:type-display-02 mt-5">
            {HOMEPAGE_HERO.title}
          </h1>
          <p className="type-body-lg text-on-brand/85 mt-6 max-w-prose">
            {HOMEPAGE_HERO.copy}
          </p>
          <div className="mt-6">
            <Button href={HOMEPAGE_HERO.cta.href} variant="brand" size="cta">
              {HOMEPAGE_HERO.cta.children}
            </Button>
          </div>
          <Image
            src={HOMEPAGE_HERO.trustMarks.src}
            alt={HOMEPAGE_HERO.trustMarks.alt}
            width={HOMEPAGE_HERO.trustMarks.width}
            height={HOMEPAGE_HERO.trustMarks.height}
            sizes="(min-width: 768px) 36rem, 90vw"
            className="mt-6 h-auto w-full max-w-md"
          />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
