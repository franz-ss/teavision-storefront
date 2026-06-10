import Image from 'next/image'

import { Eyebrow, Section } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'

import { HomepageNewsletterForm } from './newsletter-form'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

// Decorative tea/botanical image: absolutely positioned, right-side bleed
// Uses Shopify CDN asset already in the project. Dynamic offset values that
// Tailwind cannot statically extract must use style={} per conventions exception.
const DECOR_IMAGE = {
  src: 'https://cdn.shopify.com/s/files/1/0786/8339/files/c5a075ef4595339b60bb1672bb1d67e168a564a5.png?v=1757589972&width=1500',
  alt: '',
  width: 1500,
  height: 1000,
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    <Section.Root tone="sunken" className="pt-0">
      <Section.Container>
        <div
          className="relative overflow-hidden rounded-lg bg-brand-deep text-paper"
          style={{ padding: 'clamp(40px,6vw,72px)' }}
        >
          {/* Decorative image layer — exact offsets from design .news .ph */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 select-none"
            style={{
              right: '-6%',
              top: '-20%',
              width: '46%',
              height: '140%',
              opacity: 0.5,
            }}
          >
            <Image
              src={DECOR_IMAGE.src}
              alt={DECOR_IMAGE.alt}
              fill
              sizes="46vw"
              className="object-cover"
            />
          </div>

          {/* Body — z-1 above the decorative layer */}
          <div className="relative z-1 max-w-120">
            <Eyebrow tone="gold">Monthly newsletter</Eyebrow>
            <h2 className="type-heading-02 mt-4 text-paper">
              Explore the world of tea, monthly.
            </h2>
            <p className="mt-3.5 type-lede text-paper/85">
              Market insights, brewing tips and the latest from trusted
              suppliers in Australia and beyond.
            </p>

            <HomepageNewsletterForm action={action} />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
