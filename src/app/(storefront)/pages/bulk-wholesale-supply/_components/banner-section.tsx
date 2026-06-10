import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { BANNER_IMAGE_SRC } from '../_lib/data'

export function BannerSection() {
  return (
    <Section.Root
      tone="brand"
      spacing="none"
      className="relative isolate min-h-64 overflow-hidden md:min-h-80"
    >
      <Image
        src={BANNER_IMAGE_SRC}
        alt="Bulk wholesale tea and ingredients"
        fill
        sizes="100vw"
        priority
        className="absolute inset-0 -z-20 object-cover object-center"
        unoptimized
      />
      <div aria-hidden="true" className="bg-ink/55 absolute inset-0 -z-10" />
      <Section.Container className="flex min-h-64 flex-col items-center justify-center gap-4 py-12 text-center md:min-h-80">
        <h2 className="type-heading-01 text-paper">BULK WHOLESALE ACCOUNT</h2>
        <p className="type-lede text-paper/85 max-w-[52ch]">
          Access 1500+ Ingredients Direct from Farms and Save
        </p>
        <Button
          href="/pages/appi-compliance?view=bulk-wholesale-supply"
          variant="inverse"
          size="lg"
        >
          Apply Now
        </Button>
      </Section.Container>
    </Section.Root>
  )
}
