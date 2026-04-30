'use client'

type Variant = {
  id: string
  title: string
  available: boolean
}

type VariantSelectorProps = {
  variants?: Variant[]
}

export function VariantSelector({ variants = [] }: VariantSelectorProps) {
  if (variants.length === 0) {
    return (
      <div className="rounded border border-dashed p-4 text-sm text-text-muted">
        Variant selector placeholder
      </div>
    )
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Size</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            disabled={!v.available}
            aria-label={`${v.title}${!v.available ? ', out of stock' : ''}`}
            className="rounded border px-4 py-2 text-sm font-medium hover:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {v.title}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
