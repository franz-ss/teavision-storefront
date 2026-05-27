import Link from 'next/link'

import { SERVICES_LINKS } from './mega-nav-data'
import { PANEL_LINK_CLASS } from './mega-nav-styles'

export function ServicesLinks({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p className="type-caption text-muted mb-2">Services</p>
      <ul className="grid gap-1" role="list">
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
