import { describe, expect, it } from 'vitest'

import { getSelectedCollectionFilterLabels } from './filters'
import { FilterType, type CollectionProductFilter } from './types'

describe('getSelectedCollectionFilterLabels', () => {
  it('resolves selected serialized filter inputs to Shopify display labels', () => {
    const specialtyTeaInput = JSON.stringify({
      tag: 'categories_Specialty Tea',
    })
    const filters: CollectionProductFilter[] = [
      {
        id: 'filter.p.tag.categories',
        label: 'Category',
        type: FilterType.List,
        values: [
          {
            id: 'filter.p.tag.categories-specialty-tea',
            label: 'Specialty Tea',
            count: 1,
            input: specialtyTeaInput,
          },
        ],
      },
    ]

    expect(
      getSelectedCollectionFilterLabels(filters, [specialtyTeaInput]),
    ).toEqual([{ input: specialtyTeaInput, label: 'Specialty Tea' }])
  })

  it('falls back to the raw input when filter metadata is unavailable', () => {
    expect(getSelectedCollectionFilterLabels([], ['unknown-filter'])).toEqual([
      { input: 'unknown-filter', label: 'unknown-filter' },
    ])
  })
})
