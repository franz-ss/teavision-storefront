import Link from 'next/link'

import { CATALOGUE_LINKS } from './data'
import { PANEL_LINK_CLASS } from './styles'

export function CatalogueLinks({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p className="text-ink-faint mb-3 font-mono text-[10.5px] tracking-[0.14em] uppercase">
        Catalogues
      </p>
      <ul className="-mx-2.5 grid gap-0.5" role="list">
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
