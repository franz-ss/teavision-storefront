import { ArrowRight } from 'lucide-react'

import { Button, Section } from '@/components/ui'

import { HERO_IMAGE, THUMBNAILS, HERO_PROOF_POINTS } from '../_lib/data'
import { BlendImage } from './blend-image'
import { Breadcrumb } from './breadcrumb'

export function HeroSection() {
  return (
    <Section.Root tone="sunken" className="border-default border-b">
      <Section.Container>
        <Breadcrumb />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,0.62fr)] lg:items-center">
          <div className="max-w-4xl">
            <p className="type-eyebrow text-accent">
              Custom Tea Blending: R&D + Naturopath Support
            </p>
            <h1 className="type-heading-02 text-strong md:type-display-01 mt-5 text-balance">
              Craft your brand&rsquo;s signature tea blend with Teavision&reg;.
            </h1>
            <p className="type-body-lg text-muted mt-6 max-w-2xl">
              We turn your idea into a retail-ready product: formulation,
              sourcing, compliance, and packaging for Australia and export
              markets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#blend-brief" size="cta">
                Speak to our team about a custom blend
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button href="/pages/contact" variant="secondary" size="cta">
                Contact Teavision
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3" role="list">
              {HERO_PROOF_POINTS.map((point) => (
                <li
                  key={point}
                  className="type-label border-default bg-canvas rounded-md border px-3 py-2"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3">
            <BlendImage
              image={HERO_IMAGE}
              priority
              sizes="(min-width: 1024px) 38rem, 100vw"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {THUMBNAILS.map((image) => (
                <div key={image.src} className="aspect-square">
                  <BlendImage
                    image={image}
                    sizes="(min-width: 1024px) 9rem, (min-width: 640px) 25vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
