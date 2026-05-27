import Link from 'next/link'

import { CATALOGUE_LINKS } from './mega-nav-data'
import { PANEL_LINK_CLASS } from './mega-nav-styles'

export function CatalogueLinks({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p className="type-caption text-muted mb-2">Catalogues</p>
      <ul className="grid gap-1" role="list">
        {CATALOGUE_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={PANEL_LINK_CLASS} onClick={onClose}>
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <Link
            href="/pages/certifications"
            className={PANEL_LINK_CLASS}
            onClick={onClose}
          >
            Organic | Food Safety | Certs and Awards
          </Link>
        </li>
      </ul>
    </div>
  )
}
