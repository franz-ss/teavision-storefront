import Image from 'next/image'
import { Check } from 'lucide-react'

import { Button, Eyebrow, Section } from '@/components/ui'
import type { HomepageContent } from '@/lib/sanity/home-page'

export type OrganicHerbsProps = HomepageContent['organicHerbs']

export function OrganicHerbs({
  checklist,
  cta,
  image,
  intro,
}: OrganicHerbsProps) {
  return (
    <Section.Root tone="sunken" spacing="none" className="overflow-hidden">
      <div className="relative isolate min-h-110 overflow-hidden md:min-h-120 lg:min-h-130">
        <Image
          src={image.src}
          alt={image.alt}
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
            {intro.eyebrow && (
              <Eyebrow className="mb-4">{intro.eyebrow}</Eyebrow>
            )}
            <h2 className="type-heading-02">{intro.title}</h2>
            {intro.copy && (
              <p className="type-lede text-ink-soft mt-4">{intro.copy}</p>
            )}
            <ul className="mt-6 flex flex-col gap-3">
              {checklist.map((item) => (
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
              <Button href={cta.href} variant="brand" size="lg">
                {cta.children}
              </Button>
            </div>
          </div>
        </Section.Container>
      </div>
    </Section.Root>
  )
}
