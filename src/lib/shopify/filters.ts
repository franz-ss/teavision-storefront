import type { CollectionProductFilter } from './types'

export type SelectedCollectionFilterLabel = {
  input: string
  label: string
}

export function getSelectedCollectionFilterLabels(
  filters: CollectionProductFilter[],
  selectedFilters: string[],
): SelectedCollectionFilterLabel[] {
  const labelByInput = new Map<string, string>()

  filters.forEach((filter) => {
    filter.values.forEach((value) => {
      labelByInput.set(value.input, value.label)
    })
  })

  return selectedFilters.map((input) => ({
    input,
    label: labelByInput.get(input) ?? input,
  }))
}
