import {
  CertificationCoverage,
  ProofPoints,
  SupplyChain,
} from '@/components/homepage'

import { AwardExcellenceSection } from './award-excellence-section'
import { CertificationsHeroSection } from './certifications-hero-section'
import { CertificationsCtaSection } from './certifications-cta-section'
import { TrustPointsSection } from './trust-points-section'

export function CertificationsPageContent() {
  return (
    <>
      <CertificationsHeroSection />
      <ProofPoints />
      <CertificationCoverage />
      <SupplyChain />
      <TrustPointsSection />
      <AwardExcellenceSection />
      <CertificationsCtaSection />
    </>
  )
}
