import { Button, Section } from '@/components/ui'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<void>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <Section.Intro
          variant="compact"
          title="Explore the World of Tea with Monthly Newsletters"
          copy="Stay informed with monthly updates on loose leaf tea, bulk tea bags,
          herbs, and spices. From market insights to brewing tips, we share the
          latest news and trends from trusted tea suppliers in Australia and
          beyond."
        />

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
