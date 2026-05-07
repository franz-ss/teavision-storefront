import Image from 'next/image'
import Link from 'next/link'

import { Button, Section } from '@/components/ui'

import { HOMEPAGE_HERO_IMAGE, ORGANIC_CERTIFICATION_IMAGE } from '../content'

export function HomepageHero() {
  return (
    <Section.Root
      tone="brandStrong"
      className="relative isolate overflow-hidden"
    >
      <Image
        src={HOMEPAGE_HERO_IMAGE.src}
        alt={HOMEPAGE_HERO_IMAGE.alt}
        fill
        sizes="100vw"
        preload
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="bg-inverse/75 absolute inset-0 -z-10"
      />
      <Section.Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="type-eyebrow text-on-brand/75">
            Wholesale tea, herbs and spices
          </p>
          <h1 className="type-display-01 text-on-brand mt-5">
            Certified organic ingredients for serious tea programs.
          </h1>
          <p className="type-body-lg text-on-brand/85 mt-6 max-w-prose">
            Teavision supplies cafes, retailers, restaurants, and wellness
            brands with wholesale tea, botanicals, custom blending, private
            label packing, and documentation-ready organic options.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/pages/wholesale" variant="inverse" size="cta">
              Apply for wholesale
            </Button>
            <Button
              href="/pages/download-catalogues"
              variant="inverseSecondary"
              size="cta"
            >
              Download catalogue
            </Button>
          </div>
          <p className="type-label text-on-brand/75 mt-8 max-w-prose">
            1,000+ ingredients, 500+ certified organic options, sourced through
            15+ countries for more than 1,000 business customers.
          </p>
        </div>
        <aside className="border-default bg-surface text-default shadow-2 self-end rounded-md border p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Image
              src={ORGANIC_CERTIFICATION_IMAGE.src}
              alt={ORGANIC_CERTIFICATION_IMAGE.alt}
              width={ORGANIC_CERTIFICATION_IMAGE.width}
              height={ORGANIC_CERTIFICATION_IMAGE.height}
              className="bg-canvas h-16 w-16 shrink-0 rounded-full object-contain p-2"
            />
            <div>
              <p className="type-eyebrow text-accent">Buyer proof</p>
              <h2 className="type-heading-04 text-strong mt-2">
                Organic range, supply scale, real account support.
              </h2>
            </div>
          </div>
          <p className="type-body-sm text-muted mt-5">
            Build a wholesale range around certified organic ingredients,
            private label options, and catalogue depth that procurement teams
            can review without chasing missing details.
          </p>
          <Link
            href="#need-help"
            className="type-label text-brand hover:text-link-hover focus-visible:ring-ring mt-6 inline-flex min-h-11 items-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Talk to our experts
          </Link>
        </aside>
      </Section.Container>
    </Section.Root>
  )
}
