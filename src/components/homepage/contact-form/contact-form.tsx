import { Button } from '@/components/ui'

type HomepageContactFormProps = {
  action: (formData: FormData) => Promise<void>
}

export function HomepageContactForm({ action }: HomepageContactFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="type-label text-strong" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={100}
            placeholder="Enter Name"
            className="type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted min-h-12 w-full rounded-md border px-4 focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="grid gap-2">
          <label className="type-label text-strong" htmlFor="contact-phone">
            Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="Enter Number"
            className="type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted min-h-12 w-full rounded-md border px-4 focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="type-label text-strong" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="Enter Email"
          className="type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted min-h-12 w-full rounded-md border px-4 focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div className="grid gap-2">
        <label className="type-label text-strong" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="Enter Message"
          className="type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted w-full rounded-md border px-4 py-3 focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div className="sr-only" aria-hidden="true">
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Button type="submit" size="cta">
        Submit
      </Button>
    </form>
  )
}
