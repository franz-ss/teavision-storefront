import Link from 'next/link'

import { SERVICES_LINKS } from '../data'
import { PANEL_LINK_CLASS } from '../styles'

export function ServicesLinks({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p className="text-ink-faint mb-3 font-mono text-[10.5px] tracking-[0.14em] uppercase">
        Services
      </p>
      <ul className="-mx-2.5 grid gap-0.5" role="list">
        {SERVICES_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={PANEL_LINK_CLASS}
              onClick={onClose}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
