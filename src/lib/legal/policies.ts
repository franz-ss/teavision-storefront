export type LegalPolicyStatus = 'pending_owner_legal_review' | 'approved'

export type LegalPolicyHandle =
  | 'privacy-policy'
  | 'shipping-policy'
  | 'refund-policy'
  | 'terms-of-service'
  | 'cookie-preferences'

export type LegalPolicy = {
  handle: LegalPolicyHandle
  href: `/pages/${LegalPolicyHandle}`
  title: string
  description: string
  status: LegalPolicyStatus
  lastReviewed: string
  includeInFooter: boolean
  sitemap: boolean
  redirectSources: readonly string[]
}

export type LegalPolicyLink = {
  href: LegalPolicy['href']
  label: string
}

export type LegalPolicyRedirect = {
  source: string
  destination: LegalPolicy['href']
  permanent: true
}

const INITIAL_REVIEW_DATE = '2026-06-22'

const LEGAL_POLICIES_BY_HANDLE = {
  'privacy-policy': {
    handle: 'privacy-policy',
    href: '/pages/privacy-policy',
    title: 'Privacy Policy',
    description:
      'Launch-review privacy route for how Teavision expects to handle customer and visitor information.',
    status: 'pending_owner_legal_review',
    lastReviewed: INITIAL_REVIEW_DATE,
    includeInFooter: true,
    sitemap: true,
    redirectSources: [
      '/policies/privacy-policy',
      '/7868339/policies/privacy-policy.html',
    ],
  },
  'shipping-policy': {
    handle: 'shipping-policy',
    href: '/pages/shipping-policy',
    title: 'Shipping Policy',
    description:
      'Launch-review shipping route for delivery, dispatch, and fulfilment guidance.',
    status: 'pending_owner_legal_review',
    lastReviewed: INITIAL_REVIEW_DATE,
    includeInFooter: true,
    sitemap: true,
    redirectSources: [
      '/policies/shipping-policy',
      '/7868339/policies/shipping-policy.html',
    ],
  },
  'refund-policy': {
    handle: 'refund-policy',
    href: '/pages/refund-policy',
    title: 'Refund Policy',
    description:
      'Launch-review returns and refunds route for pre-approval policy coverage.',
    status: 'pending_owner_legal_review',
    lastReviewed: INITIAL_REVIEW_DATE,
    includeInFooter: true,
    sitemap: true,
    redirectSources: [
      '/policies/refund-policy',
      '/7868339/policies/refund-policy.html',
    ],
  },
  'terms-of-service': {
    handle: 'terms-of-service',
    href: '/pages/terms-of-service',
    title: 'Terms of Service',
    description:
      'Launch-review terms route for order, account, and storefront use expectations.',
    status: 'pending_owner_legal_review',
    lastReviewed: INITIAL_REVIEW_DATE,
    includeInFooter: true,
    sitemap: true,
    redirectSources: [
      '/policies/terms-of-service',
      '/7868339/policies/terms-of-service.html',
    ],
  },
  'cookie-preferences': {
    handle: 'cookie-preferences',
    href: '/pages/cookie-preferences',
    title: 'Cookie Preferences',
    description:
      'Stable launch-review route for visitor consent and cookie preference controls.',
    status: 'pending_owner_legal_review',
    lastReviewed: INITIAL_REVIEW_DATE,
    includeInFooter: true,
    sitemap: true,
    redirectSources: [],
  },
} satisfies Record<LegalPolicyHandle, LegalPolicy>

export const LEGAL_POLICIES = Object.values(LEGAL_POLICIES_BY_HANDLE)

export function getLegalPolicy(handle: LegalPolicyHandle): LegalPolicy {
  return LEGAL_POLICIES_BY_HANDLE[handle]
}

export function isLegalPolicyHandle(
  handle: string,
): handle is LegalPolicyHandle {
  return Object.hasOwn(LEGAL_POLICIES_BY_HANDLE, handle)
}

export function getFooterLegalLinks(): LegalPolicyLink[] {
  return LEGAL_POLICIES.filter((policy) => policy.includeInFooter).map(
    (policy) => ({
      href: policy.href,
      label: policy.title,
    }),
  )
}

export function getPolicyRedirects(): LegalPolicyRedirect[] {
  return LEGAL_POLICIES.flatMap((policy) =>
    policy.redirectSources.map((source) => ({
      source,
      destination: policy.href,
      permanent: true,
    })),
  )
}

export function getSitemapLegalPages(): LegalPolicy[] {
  return LEGAL_POLICIES.filter((policy) => policy.sitemap)
}
