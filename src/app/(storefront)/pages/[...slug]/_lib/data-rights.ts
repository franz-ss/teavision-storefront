const PRIVACY_EMAIL = 'info@teavision.com.au'

export type DataRight = {
  title: string
  description: string
  requestLabel: string
  subject: string
  /** `erasure` rights are account-destructive: shown last, outlined action, warning note. */
  variant?: 'default' | 'erasure'
  warning?: string
}

export type ProcessNote = {
  term: string
  detail: string
}

export type DataRightsProfile = {
  /** Hero kicker, e.g. "European Union & UK". */
  jurisdiction: string
  lede: string
  laws: string[]
  /** Optional plain-language note about which territories the page covers. */
  coverage?: string
  rights: DataRight[]
  process: ProcessNote[]
  support: {
    title: string
    copy: string
  }
}

const ERASURE_WARNING =
  'This permanently deletes your account. You will no longer be able to access it or your order history.'

export function buildRequestHref(subject: string): string {
  const body = [
    'Hello Teavision team,',
    '',
    `I would like to make the following request: ${subject}.`,
    '',
    'Full name:',
    'Email on my account:',
    'Order number (if relevant):',
    '',
    'Thank you.',
  ].join('\n')

  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return `mailto:${PRIVACY_EMAIL}?${query}`
}

const IDENTITY_NOTE: ProcessNote = {
  term: 'Identity first',
  detail: 'We confirm your identity by email before actioning any request.',
}

const DATA_RIGHTS_PROFILES: Record<string, DataRightsProfile> = {
  'gdpr-compliance': {
    jurisdiction: 'European Union & UK',
    lede: 'Exercise your rights under the General Data Protection Regulation. Every request below reaches the Teavision team directly, no login required.',
    laws: ['EU 2016/679', 'UK GDPR'],
    rights: [
      {
        title: 'Access your data',
        description:
          'Get a copy of the personal data we hold about you and how it is used.',
        requestLabel: 'Request access',
        subject: 'GDPR data access request',
      },
      {
        title: 'Correct your data',
        description:
          'Ask us to fix personal data that is inaccurate or incomplete.',
        requestLabel: 'Request a correction',
        subject: 'GDPR data correction request',
      },
      {
        title: 'Take your data with you',
        description:
          'Receive your data, including order history, in a portable format.',
        requestLabel: 'Request a copy',
        subject: 'GDPR data portability request',
      },
      {
        title: 'Restrict or object',
        description:
          'Limit how we process your data, or object to a specific use.',
        requestLabel: 'Restrict processing',
        subject: 'GDPR processing restriction request',
      },
      {
        title: 'Erase your data',
        description: 'The right to be forgotten.',
        requestLabel: 'Request erasure',
        subject: 'GDPR data erasure request',
        variant: 'erasure',
        warning: ERASURE_WARNING,
      },
    ],
    process: [
      IDENTITY_NOTE,
      {
        term: 'Within 30 days',
        detail: 'We respond inside the GDPR Article 12 window.',
      },
      {
        term: 'No charge',
        detail: 'Requests are free unless they are manifestly excessive.',
      },
    ],
    support: {
      title: 'Not sure which request you need?',
      copy: 'Email our team and we will guide you to the right request.',
    },
  },
  'us-laws-compliance': {
    jurisdiction: 'United States',
    lede: 'Exercise your privacy rights under US state law. Every request below reaches the Teavision team directly, no login required.',
    laws: ['CCPA-CPRA', 'VCDPA', 'CPA', 'CTDPA'],
    coverage:
      'Covers California, Virginia, Colorado, and Connecticut state privacy laws.',
    rights: [
      {
        title: 'Access your data',
        description:
          'Get a copy of the personal information we have collected about you.',
        requestLabel: 'Request access',
        subject: 'US privacy data access request',
      },
      {
        title: 'Correct your data',
        description: 'Ask us to fix inaccurate personal information.',
        requestLabel: 'Request a correction',
        subject: 'US privacy data correction request',
      },
      {
        title: 'Take your data with you',
        description:
          'Receive your personal information, including orders, in a portable format.',
        requestLabel: 'Request a copy',
        subject: 'US privacy data portability request',
      },
      {
        title: 'Do not sell or share',
        description:
          'Opt out of the sale or sharing of your personal information.',
        requestLabel: 'Opt out',
        subject: 'US do not sell or share my personal information',
      },
      {
        title: 'Delete your data',
        description: 'Ask us to delete the personal information we hold.',
        requestLabel: 'Request deletion',
        subject: 'US privacy data deletion request',
        variant: 'erasure',
        warning: ERASURE_WARNING,
      },
    ],
    process: [
      IDENTITY_NOTE,
      {
        term: 'Within 45 days',
        detail: 'We respond inside the timeframe set by US state law.',
      },
      {
        term: 'No charge',
        detail: 'Requests are free for up to two each year.',
      },
    ],
    support: {
      title: 'Not sure which request you need?',
      copy: 'Email our team and we will guide you to the right request.',
    },
  },
  'pipeda-compliance': {
    jurisdiction: 'Canada',
    lede: "Exercise your rights under Canada's Personal Information Protection and Electronic Documents Act. Every request below reaches the Teavision team directly.",
    laws: ['PIPEDA'],
    rights: [
      {
        title: 'Access your data',
        description:
          'Get a copy of the personal information we hold and how it is used.',
        requestLabel: 'Request access',
        subject: 'PIPEDA data access request',
      },
      {
        title: 'Correct your data',
        description:
          'Ask us to fix personal information that is inaccurate or incomplete.',
        requestLabel: 'Request a correction',
        subject: 'PIPEDA data correction request',
      },
      {
        title: 'Withdraw consent',
        description:
          'Withdraw your consent to our use of your personal information.',
        requestLabel: 'Withdraw consent',
        subject: 'PIPEDA consent withdrawal request',
      },
      {
        title: 'Delete your data',
        description: 'Ask us to delete the personal information we hold.',
        requestLabel: 'Request deletion',
        subject: 'PIPEDA data deletion request',
        variant: 'erasure',
        warning: ERASURE_WARNING,
      },
    ],
    process: [
      IDENTITY_NOTE,
      {
        term: 'Within 30 days',
        detail: 'We respond inside the PIPEDA 30-day window.',
      },
      {
        term: 'No charge',
        detail: 'Requests are handled at minimal or no cost.',
      },
    ],
    support: {
      title: 'Not sure which request you need?',
      copy: 'Email our team and we will guide you to the right request.',
    },
  },
  'appi-compliance': {
    jurisdiction: 'Japan',
    lede: "Exercise your rights under Japan's Act on the Protection of Personal Information. Every request below reaches the Teavision team directly.",
    laws: ['APPI'],
    rights: [
      {
        title: 'Disclosure',
        description:
          'Request disclosure of the personal data we hold about you.',
        requestLabel: 'Request disclosure',
        subject: 'APPI data disclosure request',
      },
      {
        title: 'Correct your data',
        description: 'Ask us to correct, add to, or update inaccurate data.',
        requestLabel: 'Request a correction',
        subject: 'APPI data correction request',
      },
      {
        title: 'Stop third-party sharing',
        description: 'Ask us to stop providing your data to third parties.',
        requestLabel: 'Stop sharing',
        subject: 'APPI third-party provision cessation request',
      },
      {
        title: 'Cease use or delete',
        description: 'Ask us to stop using or to delete your personal data.',
        requestLabel: 'Request cessation',
        subject: 'APPI cease use or deletion request',
        variant: 'erasure',
        warning: ERASURE_WARNING,
      },
    ],
    process: [
      IDENTITY_NOTE,
      {
        term: 'Reasonable period',
        detail: 'We respond within a reasonable period as required by the APPI.',
      },
      {
        term: 'No charge',
        detail: 'Requests are handled at minimal or no cost.',
      },
    ],
    support: {
      title: 'Not sure which request you need?',
      copy: 'Email our team and we will guide you to the right request.',
    },
  },
}

export function isDataRightsHandle(handle: string): boolean {
  return handle in DATA_RIGHTS_PROFILES
}

export function resolveDataRightsProfile(
  handle: string,
): DataRightsProfile | null {
  return DATA_RIGHTS_PROFILES[handle] ?? null
}
