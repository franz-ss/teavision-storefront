import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { EXPERTS_LEFT_IMAGE, EXPERTS_RIGHT_IMAGE } from '../content'

export function ExpertsHelp() {
  return (
    <Section.Root tone="surface" className="relative overflow-hidden">
      <Image
        src={EXPERTS_LEFT_IMAGE.src}
        alt={EXPERTS_LEFT_IMAGE.alt}
        width={EXPERTS_LEFT_IMAGE.width}
        height={EXPERTS_LEFT_IMAGE.height}
        className="absolute top-1/2 left-8 hidden h-48 w-56 -translate-y-1/2 rounded-lg object-cover opacity-80 lg:block"
      />
      <Image
        src={EXPERTS_RIGHT_IMAGE.src}
        alt={EXPERTS_RIGHT_IMAGE.alt}
        width={EXPERTS_RIGHT_IMAGE.width}
        height={EXPERTS_RIGHT_IMAGE.height}
        className="absolute top-10 right-8 hidden h-44 w-44 rounded-lg object-cover opacity-80 lg:block"
      />
      <Section.Container className="relative z-10 text-center">
        <h2 className="type-heading-02 text-strong">
          Let the experts help GROW your business
        </h2>
        <p className="type-body text-muted mt-5">
          Here at Teavision, we take pride in everything we do and we&apos;re
          always on a mission to source the best ingredients at the lowest
          prices. Our team of certified tea masters and herbalists are dedicated
          to helping your business grow and achieve it&apos;s goals.
        </p>
        <div className="mt-8">
          <Button href="#need-help" size="cta">
            Contact the Team
          </Button>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
