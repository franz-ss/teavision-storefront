import {
  CertificationCoverage,
  HomepageHero,
  ProofPoints,
  SupplyChain,
} from '@/components/homepage'

import { AwardExcellenceSection } from './award-excellence-section'
import { CertificationsCtaSection } from './certifications-cta-section'
import { TrustPointsSection } from './trust-points-section'

export function CertificationsPageContent() {
  return (
    <>
      <HomepageHero />
      <ProofPoints />
      <CertificationCoverage />
      <SupplyChain />
      <TrustPointsSection />
      <AwardExcellenceSection />
      <CertificationsCtaSection />
    </>
  )
}
