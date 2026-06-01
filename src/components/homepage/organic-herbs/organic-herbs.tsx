import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { HERBS_IMAGE } from '../content'

export function OrganicHerbs() {
  return (
    <Section.Root tone="sunken">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="type-heading-02 text-strong">
            Wild Grown & Certified Organic Herbs
          </h2>
          <p className="type-body text-muted mt-5">
            We supply only the freshest wild grown herbs and certified organic
            spices, sourced directly from trusted farmers and plantations. As
            one of Australia’s leading bulk herb and spice suppliers, we ensure
            quality, sustainability, and reliability to meet the diverse needs
            of cafes, retailers, and wellness brands.
          </p>
          <ul className="type-body-sm text-muted mt-8 grid gap-3">
            <li>Import and Freight Insurance on all ingredients</li>
            <li>Highest quality standards from our company and partners</li>
            <li>
              Quality-focused, consistent, efficient, reliable and
              cost-effective
            </li>
          </ul>
          <div className="mt-8">
            <Button
              href="/pages/terms-conditions-1"
              aria-label="Learn More about quality standards"
              size="cta"
            >
              Learn More
              <span className="sr-only"> about quality standards</span>
            </Button>
          </div>
        </div>
        <div className="bg-surface shadow-2 overflow-hidden rounded-md">
          <Image
            src={HERBS_IMAGE.src}
            alt={HERBS_IMAGE.alt}
            width={HERBS_IMAGE.width}
            height={HERBS_IMAGE.height}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-3/2 h-full w-full object-cover"
          />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
