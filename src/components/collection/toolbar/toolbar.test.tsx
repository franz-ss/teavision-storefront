/**
 * @vitest-environment jsdom
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { FilterType, type CollectionProductFilter } from '@/lib/shopify/types'

import { Toolbar } from './toolbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/collections/all',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Toolbar', () => {
  it('renders active filter chips using their display labels', () => {
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

    const html = renderToStaticMarkup(
      <Toolbar
        currentSort="featured"
        productCount={1}
        filters={filters}
        selectedFilters={[specialtyTeaInput]}
      />,
    )

    expect(html).toContain('Specialty Tea')
    expect(html).not.toContain(specialtyTeaInput.replace(/"/g, '&quot;'))
  })
})
