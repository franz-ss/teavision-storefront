import { describe, expect, test } from 'vitest'

import { makeCustomerAccountAddress } from '@/tests/fixtures/shopify/customer-account'

import {
  formatAddressLines,
  sortDefaultAddressFirst,
} from './address-formatting'

describe('account address formatting', () => {
  test('sorts the default address before non-default addresses', () => {
    const defaultAddress = makeCustomerAccountAddress({
      id: 'gid://shopify/CustomerAddress/default',
    })
    const secondaryAddress = makeCustomerAccountAddress({
      id: 'gid://shopify/CustomerAddress/secondary',
    })

    expect(
      sortDefaultAddressFirst(
        [secondaryAddress, defaultAddress],
        defaultAddress.id,
      ).map((address) => address.id),
    ).toEqual([defaultAddress.id, secondaryAddress.id])
  })

  test('builds address lines when Shopify formatted lines are absent', () => {
    expect(
      formatAddressLines(
        makeCustomerAccountAddress({
          formatted: [],
        }),
      ),
    ).toEqual([
      'Avery Nguyen',
      '12 Market Lane',
      'Suite 4',
      'Melbourne VIC 3000',
      'AU',
    ])
  })
})
