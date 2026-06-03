import { WHOLESALE_INCLUSIONS } from '../_lib/wholesale-content'

export function WholesaleInclusions() {
  return (
    <aside className="border-default border-y py-6">
      <p className="type-eyebrow text-muted">What&rsquo;s included</p>
      <ul className="mt-5 grid gap-4" role="list">
        {WHOLESALE_INCLUSIONS.map((item) => (
          <li key={item} className="type-body-sm flex gap-3">
            <span
              className="bg-brand mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="border-default mt-8 border-t pt-6">
        <p className="type-eyebrow text-muted">Direct contact</p>
        <dl className="mt-4 grid gap-4">
          <div>
            <dt className="type-caption text-muted">Phone</dt>
            <dd className="type-label mt-1">
              <a
                href="tel:1300729617"
                className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                1300 729 617
              </a>
            </dd>
          </div>
          <div>
            <dt className="type-caption text-muted">Email</dt>
            <dd className="type-label mt-1">
              <a
                href="mailto:wholesale@teavision.com.au"
                className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                wholesale@teavision.com.au
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
