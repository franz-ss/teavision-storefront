import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { NEWSLETTER_LEFT_IMAGE, NEWSLETTER_RIGHT_IMAGE } from '../content'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<void>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    <Section.Root tone="brand" className="relative overflow-hidden">
      <Image
        src={NEWSLETTER_LEFT_IMAGE.src}
        alt={NEWSLETTER_LEFT_IMAGE.alt}
        width={NEWSLETTER_LEFT_IMAGE.width}
        height={NEWSLETTER_LEFT_IMAGE.height}
        className="absolute top-1/2 left-8 hidden h-48 w-56 -translate-y-1/2 rounded-lg object-cover opacity-80 lg:block"
      />
      <Image
        src={NEWSLETTER_RIGHT_IMAGE.src}
        alt={NEWSLETTER_RIGHT_IMAGE.alt}
        width={NEWSLETTER_RIGHT_IMAGE.width}
        height={NEWSLETTER_RIGHT_IMAGE.height}
        className="absolute top-10 right-8 hidden h-44 w-44 rounded-lg object-cover opacity-80 lg:block"
      />
      <Section.Container className="relative z-10 text-center">
        <h2 className="type-heading-02 text-on-brand">
          Explore the World of Tea with Monthly Newsletters
        </h2>
        <p className="type-body text-on-brand/85 mt-4">
          Stay informed with monthly updates on loose leaf tea, bulk tea bags,
          herbs, and spices. From market insights to brewing tips, we share the
          latest news and trends from trusted tea suppliers in Australia and
          beyond.
        </p>
        <form
          action={action}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
        >
          <label className="sr-only" htmlFor="homepage-newsletter-email">
            Enter Email
          </label>
          <input
            id="homepage-newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="Enter Email"
            className="type-body-sm focus-visible:ring-ring border-on-brand/30 bg-canvas text-strong placeholder:text-muted min-h-12 flex-1 rounded-md border px-4 focus-visible:ring-2 focus-visible:outline-none"
          />
          <div className="sr-only" aria-hidden="true">
            <input
              id="homepage-newsletter-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <Button type="submit" size="cta">
            Subscribe
          </Button>
        </form>
      </Section.Container>
    </Section.Root>
  )
}
