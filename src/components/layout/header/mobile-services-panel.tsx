import { CatalogueLinks } from './catalogue-links'
import { ServicesLinks } from './services-links'
import type { ServicesMenuProps } from './services-menu-types'

export function MobileServicesPanel({ onClose, open }: ServicesMenuProps) {
  return (
    <div
      id="mobile-services-mega"
      className="border-subtle bg-surface-raised border-t"
      hidden={!open}
    >
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 sm:px-6 md:grid-cols-2">
        <ServicesLinks onClose={onClose} />
        <CatalogueLinks onClose={onClose} />
      </div>
    </div>
  )
}
