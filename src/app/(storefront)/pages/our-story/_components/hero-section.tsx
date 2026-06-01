import Image from 'next/image'
import { ArrowDown } from 'lucide-react'

import { Button, Section } from '@/components/ui'

import { HERO_IMAGE } from '../_lib/data'

export function HeroSection() {
  return (
    <Section.Root
      tone="brandStrong"
      className="border-on-brand/20 relative isolate min-h-136 overflow-hidden border-b md:min-h-164"
    >
      <Image
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        fill
        sizes="100vw"
        preload
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="bg-inverse/55 absolute inset-0 -z-10"
      />
      <Section.Container>
        <div className="max-w-4xl">
          <h1 className="type-heading-01 text-on-brand md:type-display-02 mt-5 text-balance">
            Our <span className="text-accent-subtle">Tea Story</span> <br />{' '}
            Since 2014
          </h1>
          <p className="type-body-lg text-on-brand/85 mt-6 max-w-3xl">
            Founded in Melbourne by Lucas and Belinda, Teavision combines
            passion for healthy living with the power of tea. From a small
            venture, we&apos;ve grown into one of Australia&apos;s leading
            wholesale tea and herb suppliers, trusted by over 2,000 global
            businesses seeking premium bulk tea bags and certified organic herbs
            and spices.
          </p>
          <div className="mt-8">
            <Button href="#our-team" variant="inverse" size="cta">
              Discover our Story
              <ArrowDown className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
