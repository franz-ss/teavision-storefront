import Image from 'next/image'
import { Check } from 'lucide-react'

import { Button, Section } from '@/components/ui'

import { HERBS_IMAGE } from '../content'

// Original-site copy — single-line checklist items
const HERB_CHECKLIST = [
  'Import and Freight Insurance on all ingredients',
  'Highest quality standards from our company and partners',
  'Quality-focused, consistent, efficient, reliable and cost-effective',
]

export function OrganicHerbs() {
  return (
    <Section.Root tone="sunken">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="type-heading-02">
            Wild Grown &amp; Certified Organic Herbs
          </h2>
          <p className="type-lede text-ink-soft mt-4">
            We supply only the freshest wild grown herbs and certified organic
            spices, sourced directly from trusted farmers and plantations. As
            one of Australia&apos;s leading bulk herb and spice suppliers, we
            ensure quality, sustainability, and reliability to meet the diverse
            needs of cafes, retailers, and wellness brands.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {HERB_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="text-brand mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <p className="type-body">{item}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button
              href="/collections/herbs-and-spices"
              variant="brand"
              size="lg"
              aria-label="Learn more about our herbs and spices"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="shadow-2 overflow-hidden rounded-lg">
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
