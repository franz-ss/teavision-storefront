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
    // Original-site layout: the herbs photo IS the section background,
    // anchored right; the copy sits over the photo's light left half.
    <Section.Root tone="sunken" className="relative isolate overflow-hidden">
      <Image
        src={HERBS_IMAGE.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-right"
      />
      {/* Left-to-right fade keeps the copy legible at every width */}
      <div
        aria-hidden="true"
        className="from-paper-2 via-paper-2/85 absolute inset-0 -z-10 bg-linear-to-r via-35% to-transparent"
      />
      <Section.Container>
        <div className="max-w-xl py-6 lg:py-14">
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
      </Section.Container>
    </Section.Root>
  )
}
