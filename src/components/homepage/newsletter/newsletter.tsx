import Image from 'next/image'

import { Eyebrow, Section } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'

import { HomepageNewsletterForm } from './newsletter-form'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    // Same motif-band layout as the For Business and Catalogues sections:
    // teapot illustration left, centered content + form, brush ring right.
    <Section.Root tone="inverse" className="overflow-hidden">
      <Section.Container>
        {/* Narrow motif tracks + negative margins: images keep their size and
            drift slightly past the container edge, giving the copy more width */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,160px)]">
          <div className="flex justify-center lg:-ml-18">
            <Image
              src="/images/newsletter-teapot.png"
              alt=""
              aria-hidden="true"
              width={530}
              height={378}
              className="animate-bc-float h-auto w-[clamp(200px,25vw,268px)] max-w-none object-contain motion-reduce:animate-none"
              sizes="(min-width: 1024px) 268px, 40vw"
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold" className="mb-4 justify-center">
              Monthly newsletter
            </Eyebrow>
            <h2 className="type-heading-01 text-paper">
              Explore the World of Tea with Monthly Newsletters
            </h2>
            <p className="type-lede text-paper/75 mt-4">
              Stay informed with monthly updates on loose leaf tea, bulk tea
              bags, herbs, and spices. From market insights to brewing tips, we
              share the latest news and trends from trusted tea suppliers in
              Australia and beyond.
            </p>
            <div className="flex justify-center">
              <HomepageNewsletterForm action={action} />
            </div>
          </div>

          <div className="flex justify-center lg:-mr-20">
            {/* Plain brush ring — no text overlay (owner: curved text overlapped) */}
            <Image
              src="/images/newsletter-label.png"
              alt=""
              aria-hidden="true"
              width={376}
              height={378}
              className="animate-st-float h-auto w-[clamp(140px,14vw,200px)] max-w-none object-contain motion-reduce:animate-none"
              sizes="(min-width: 1024px) 200px, 30vw"
            />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
