import { CONTACT_METHODS, SOCIAL_LINKS, SUPPLY_NOTES } from '../_lib/page-data'
import { Icon } from './icons'

export function Sidebar() {
  return (
    <aside className="border-default border-y py-6 lg:sticky lg:top-8">
      <div>
        <p className="text-muted type-eyebrow">Direct lines</p>
        <h2 className="type-heading-02 mt-3">Reach the team</h2>
      </div>

      <dl className="divide-border mt-6 divide-y">
        {CONTACT_METHODS.map((method) => (
          <div key={method.label} className="flex gap-4 py-5 first:pt-0">
            <div className="border-default bg-surface text-brand mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded border">
              <Icon name={method.icon} />
            </div>
            <div>
              <dt className="text-muted type-eyebrow">{method.label}</dt>
              <dd className="type-label text-default mt-1">
                <a
                  href={method.href}
                  className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                >
                  {method.value}
                </a>
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="border-default mt-8 border-t pt-6">
        <p className="text-muted type-eyebrow">Useful for</p>
        <ul className="mt-4 space-y-3" role="list">
          {SUPPLY_NOTES.map((note) => (
            <li key={note} className="type-body-sm flex gap-3">
              <span
                className="bg-action-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                aria-hidden="true"
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-default mt-8 border-t pt-6">
        <p className="text-muted type-eyebrow">Follow us</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="border-default bg-surface text-brand hover:border-brand hover:bg-brand-subtle flex h-11 w-11 items-center justify-center rounded border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Icon name={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
