export const WHOLESALE_ACCOUNT_PAGE_PATH = '/pages/wholesale-account-request'
export const WHOLESALE_ACCOUNT_PAGE_TITLE =
  'Wholesale Bulk Order Account Sign Up'
export const WHOLESALE_ACCOUNT_META_TITLE =
  'Wholesale Bulk Order Account Sign Up | Teavision'
export const WHOLESALE_ACCOUNT_DESCRIPTION =
  'Apply for a Teavision wholesale bulk order account for 100kg+ purchasing.'

export const WHOLESALE_ACCOUNT_LIMITS = {
  field: 120,
  email: 254,
  phone: 20,
  text: 1200,
} as const

export const WHOLESALE_ACCOUNT_START_OPTIONS = [
  'Immediately',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  'Just researching',
]

const WHOLESALE_ACCOUNT_START_OPTION_SET = new Set(
  WHOLESALE_ACCOUNT_START_OPTIONS,
)

export function isWholesaleAccountStartOption(value: string): boolean {
  return WHOLESALE_ACCOUNT_START_OPTION_SET.has(value)
}
