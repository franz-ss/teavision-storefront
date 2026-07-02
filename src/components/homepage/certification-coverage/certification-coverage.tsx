import {
  Flag,
  FlaskConical,
  Leaf,
  Medal,
  Shield,
  Truck,
  type LucideIcon,
} from 'lucide-react'

import type { HomepageContent } from '@/lib/sanity/home-page'

import { CERTIFICATION_COVERAGE_FIXTURE } from '../content'

const CERTIFICATION_ICON_MAP: Record<string, LucideIcon> = {
  Flag,
  FlaskConical,
  Leaf,
  Medal,
  Shield,
  Truck,
}

export type CertificationCoverageProps = {
  items?: HomepageContent['certificationCoverage']['items']
}

function getCertificationIcon(iconKey: string | null): LucideIcon {
  if (!iconKey) return Shield

  return CERTIFICATION_ICON_MAP[iconKey] ?? Shield
}

export function CertificationCoverage({
  items: certifications = CERTIFICATION_COVERAGE_FIXTURE.items,
}: CertificationCoverageProps = {}) {
  // Duplicate items for seamless -50% translateX loop.
  const items = [...certifications, ...certifications]

  return (
    <div className="border-hairline overflow-hidden border-y">
      <div
        className="animate-marquee flex w-max items-center gap-16 py-7 hover:[animation-play-state:paused] motion-reduce:animate-none"
        aria-hidden="true"
      >
        {items.map((cert, index) => {
          const Icon = getCertificationIcon(cert.iconKey)

          return (
            <span
              key={`${cert.label}-${index}`}
              className="text-ink-soft inline-flex shrink-0 items-center gap-3 font-mono text-[12px] tracking-[0.12em] uppercase"
            >
              <Icon
                className="text-brand size-6.5 shrink-0"
                aria-hidden="true"
                strokeWidth={1.6}
              />
              {cert.label}
            </span>
          )
        })}
      </div>
      {/* Accessible fallback for screen readers and reduced-motion users. */}
      <ul className="sr-only">
        {certifications.map((cert) => (
          <li key={cert.label}>{cert.label}</li>
        ))}
      </ul>
    </div>
  )
}
