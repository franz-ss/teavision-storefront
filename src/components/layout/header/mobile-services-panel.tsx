import { CatalogueLinks } from './catalogue-links'
import { ServicesLinks } from './services-links'
import type { ServicesMenuProps } from './services-menu-types'

export function MobileServicesPanel({ onClose, open }: ServicesMenuProps) {
  return (
    <div
      id="mobile-services-mega"
      className="bg-paper-2 border-t border-hairline"
      hidden={!open}
    >
      <div className="mx-auto grid max-w-wide gap-5 px-gutter py-4 md:grid-cols-2">
        <ServicesLinks onClose={onClose} />
        <CatalogueLinks onClose={onClose} />
      </div>
    </div>
  )
}
