import Image from 'next/image'

import { Section } from '@/components/ui'

export function CertificationsHeroSection() {
  return (
    <Section.Root
      tone="brandStrong"
      className="relative isolate overflow-hidden"
    >
      <Image
        src="/images/homepage-hero.jpg"
        alt=""
        fill
        sizes="100vw"
        preload
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="bg-inverse/50 absolute inset-0 -z-10"
      />
      <Section.Container>
        <div className="max-w-prose">
          <h1 className="type-display-01 text-on-brand mt-5">
            Certified Organic. Globally Sourced. Quality Assured
          </h1>
          <p className="type-body-lg text-on-brand/85 mt-6 max-w-prose">
            From organic accreditation to food safety standards, our
            certifications back every product we make. We pair rigorous quality
            systems with world-class ingredients to deliver award-winning teas.
          </p>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
