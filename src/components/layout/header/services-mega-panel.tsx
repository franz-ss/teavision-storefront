import { CatalogueLinks } from './catalogue-links'
import { ServicesLinks } from './services-links'
import type { ServicesMenuProps } from './services-menu-types'

export function ServicesMegaPanel({ onClose, open }: ServicesMenuProps) {
  return (
    <div
      id="services-menu"
      className="absolute top-full left-0 z-50 w-[34rem]"
      hidden={!open}
    >
      <div className="border-subtle bg-surface-raised max-h-[min(34rem,calc(100vh-8rem))] overflow-y-auto rounded-lg border p-4 shadow-xl">
        <div className="grid grid-cols-2 gap-5">
          <ServicesLinks onClose={onClose} />
          <CatalogueLinks onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
