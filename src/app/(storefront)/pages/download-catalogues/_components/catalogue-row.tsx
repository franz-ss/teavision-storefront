import {
  BadgeCheck,
  Download,
  FlaskConical,
  GlassWater,
  Leaf,
  Package,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

import type { Catalogue, CatalogueIcon } from '../_lib/data'

const ICONS: Record<CatalogueIcon, LucideIcon> = {
  leaf: Leaf,
  teaBag: Package,
  beverage: GlassWater,
  herbs: Sprout,
  blends: FlaskConical,
  certificate: BadgeCheck,
}

export function CatalogueRow({ catalogue }: { catalogue: Catalogue }) {
  const Icon = ICONS[catalogue.icon]

  return (
    <article className="border-hairline flex flex-col gap-5 border-t py-7 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:gap-7">
      <div
        aria-hidden="true"
        className={cn(
          'flex h-24 w-18 shrink-0 flex-col justify-between rounded-md p-3',
          catalogue.isCertificate
            ? 'bg-gold text-brand-deep'
            : 'bg-brand-deep text-paper',
        )}
      >
        <Icon
          className={cn(
            'size-5',
            catalogue.isCertificate ? 'text-brand-deep' : 'text-gold',
          )}
        />
        <span className="font-display text-sm leading-tight">
          {catalogue.plateLabel}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="type-heading-05 text-ink">{catalogue.title}</h3>
        <p className="type-body text-ink-soft mt-1.5">{catalogue.description}</p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
        <span className="type-mono-meta text-ink-faint whitespace-nowrap">
          PDF &middot; {catalogue.fileSize}
        </span>
        <Button
          href={catalogue.href}
          variant="primary"
          size="sm"
          download
          target="_blank"
          rel="noopener"
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </div>
    </article>
  )
}
