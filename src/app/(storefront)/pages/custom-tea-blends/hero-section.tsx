import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button, Section } from '@/components/ui'

import {
  CUSTOM_TEA_BLEND_HERO_IMAGE,
  CUSTOM_TEA_BLEND_THUMBNAILS,
  HERO_PROOF_POINTS,
} from './custom-tea-blends-data'
import { BlendImage } from './blend-image'

function Breadcrumb() {
  return (
    <nav className="type-body-sm text-muted mb-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2" role="list">
        <li>
          <Link
            href="/"
            className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-default" aria-current="page">
          Custom tea blends
        </li>
      </ol>
    </nav>
  )
}

export function HeroSection() {
  return (
    <Section.Root tone="sunken" className="border-default border-b">
      <Section.Container>
        <Breadcrumb />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,0.62fr)] lg:items-center">
          <div className="max-w-4xl">
            <p className="type-eyebrow text-accent">
              Custom tea blending and R&D
            </p>
            <h1 className="type-heading-02 text-strong mt-5 text-balance md:type-display-01">
              Craft your brand&rsquo;s signature tea blend with Teavision.
            </h1>
            <p className="type-body-lg text-muted mt-6 max-w-2xl">
              Turn a product idea into a retail-ready tea: formulation,
              sourcing, compliance, and packaging for Australian and export
              markets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#custom-tea-blend-brief" size="cta">
                Speak to our team
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
              image={CUSTOM_TEA_BLEND_HERO_IMAGE}
              sizes="(min-width: 1024px) 38rem, 100vw"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CUSTOM_TEA_BLEND_THUMBNAILS.map((image) => (
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
