import { Section } from '@/components/ui'

import { CATALOGUES } from '../_lib/data'
import { CatalogueRow } from './catalogue-row'

export function CataloguesSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container variant="base">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="type-heading-03 text-ink">Download catalogues</h2>
          <span className="type-mono-meta text-ink-faint whitespace-nowrap">
            {CATALOGUES.length} PDFs
          </span>
        </div>
        <div className="mt-8">
          {CATALOGUES.map((catalogue) => (
            <CatalogueRow key={catalogue.id} catalogue={catalogue} />
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
