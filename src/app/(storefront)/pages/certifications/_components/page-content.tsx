import {
  CertificationCoverage,
  ProofPoints,
  SupplyChain,
} from '@/components/homepage'

import { AwardExcellenceSection } from './award-excellence-section'
import { CtaSection } from './cta-section'
import { HeroSection } from './hero-section'
import { TrustPointsSection } from './trust-points-section'

export function PageContent() {
  return (
    <>
      <HeroSection />
      <ProofPoints />
      <CertificationCoverage />
      <SupplyChain />
      <TrustPointsSection />
      <AwardExcellenceSection />
      <CtaSection />
    </>
  )
}
