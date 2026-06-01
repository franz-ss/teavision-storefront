import { AwardsSection } from './awards-section'
import { CtaSection } from './cta-section'
import { GrowthSection } from './growth-section'
import { HeroSection } from './hero-section'
import { MissionSection } from './mission-section'
import { ResponsibilitySection } from './responsibility-section'
import { TeamSection } from './team-section'

export function PageContent() {
  return (
    <>
      <HeroSection />
      <GrowthSection />
      <MissionSection />
      <TeamSection />
      <ResponsibilitySection />
      <AwardsSection />
      <CtaSection />
    </>
  )
}
