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
    <Section.Root tone="sunken" spacing="none" className="overflow-hidden">
      <div className="relative isolate min-h-110 overflow-hidden md:min-h-120 lg:min-h-130">
        <Image
          src={HERBS_IMAGE.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-right"
        />
        {/* Left-to-right fade keeps the copy legible at every width. */}
        <div
          aria-hidden="true"
          className="from-paper-2 via-paper-2/90 absolute inset-0 -z-10 bg-linear-to-r via-45% to-transparent"
        />
        <Section.Container className="flex min-h-110 items-center py-10 md:min-h-120 md:py-12 lg:min-h-130 lg:py-14">
          <div className="max-w-xl">
            <h2 className="type-heading-02">
              Wild Grown &amp; Certified Organic Herbs
            </h2>
            <p className="type-lede text-ink-soft mt-4">
              We supply only the freshest wild grown herbs and certified organic
              spices, sourced directly from trusted farmers and plantations. As
              one of Australia&apos;s leading bulk herb and spice suppliers, we
              ensure quality, sustainability, and reliability to meet the
              diverse needs of cafes, retailers, and wellness brands.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
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
            <div className="mt-7">
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
      </div>
    </Section.Root>
  )
}
