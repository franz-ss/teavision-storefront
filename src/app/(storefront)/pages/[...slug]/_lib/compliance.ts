export type ComplianceAction = {
  label: string
}

export type ComplianceSection = {
  heading: string
  description: string
  actions: ComplianceAction[]
}

export type CompliancePage = {
  sections: ComplianceSection[]
  jurisdiction?: string
}

export const COMPLIANCE_NOTICE_LEAD =
  'The app used for assuring the GDPR, LGPD, CCPA-CPRA, VCDPA, CPA, CTDPA, APPI, PIPEDA compliance of this site, collects your IP and the email address in order to process the data. For more check '
export const COMPLIANCE_NOTICE_LINK_LABEL = 'Privacy Policy & Terms of Service'
export const COMPLIANCE_NOTICE_LINK_HREF = '/pages/terms-conditions'
export const COMPLIANCE_EMAIL_CONFIRM_LABEL =
  'Enter your email to confirm your identity'

const RECTIFICATION: ComplianceSection = {
  heading: 'Data Rectification',
  description:
    'You can use the link below to update your account data if it is not accurate.',
  actions: [{ label: 'Edit your account information' }],
}

function portability(requestsLabel: string): ComplianceSection {
  return {
    heading: 'Data Portability',
    description:
      'You can use the links below to download all the data we store and use for a better experience in our store.',
    actions: [
      { label: requestsLabel },
      { label: 'Personal information' },
      { label: 'Orders' },
    ],
  }
}

const ACCESS: ComplianceSection = {
  heading: 'Access to Personal Data',
  description:
    'You can use the link below to request a report which will contain all personal information that we store for you.',
  actions: [{ label: 'Request a report' }],
}

const RIGHT_TO_BE_FORGOTTEN: ComplianceSection = {
  heading: 'Right to be Forgotten',
  description:
    'Use this option if you want to remove your personal and other data from our store. Keep in mind that this process will delete your account, so you will no longer be able to access or use it anymore.',
  actions: [{ label: 'Request personal data deletion' }],
}

const DO_NOT_SELL: ComplianceSection = {
  heading: 'Do not Sell My Personal Information',
  description:
    'You can submit a request to let us know that you do not agree for your personal information to be collected or sold.',
  actions: [{ label: 'Do not sell my personal information' }],
}

const DO_NOT_SELL_THIRD_PARTY: ComplianceSection = {
  heading: 'Do not Sell My Personal Information to Third Party',
  description:
    'You can submit a request to let us know that you do not agree for your personal information to be collected or sold to a third party.',
  actions: [{ label: 'Do not sell my personal information' }],
}

const COMPLIANCE_PAGES: Record<string, CompliancePage> = {
  'gdpr-compliance': {
    sections: [
      RECTIFICATION,
      portability('GDPR requests'),
      ACCESS,
      RIGHT_TO_BE_FORGOTTEN,
    ],
  },
  'us-laws-compliance': {
    sections: [
      RECTIFICATION,
      portability('US Laws requests'),
      ACCESS,
      DO_NOT_SELL,
      RIGHT_TO_BE_FORGOTTEN,
    ],
    jurisdiction:
      'This page covers the laws in the following states: California (CCPA-CPRA), Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA).',
  },
  'pipeda-compliance': {
    sections: [RECTIFICATION, portability('PIPEDA requests'), ACCESS],
  },
  'appi-compliance': {
    sections: [
      RECTIFICATION,
      portability('APPI requests'),
      ACCESS,
      DO_NOT_SELL_THIRD_PARTY,
      RIGHT_TO_BE_FORGOTTEN,
    ],
  },
}

export function isComplianceHandle(handle: string): boolean {
  return handle in COMPLIANCE_PAGES
}

export function resolveCompliancePage(handle: string): CompliancePage | null {
  return COMPLIANCE_PAGES[handle] ?? null
}
