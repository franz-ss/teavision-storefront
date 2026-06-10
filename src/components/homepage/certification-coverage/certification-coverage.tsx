import {
  Flag,
  FlaskConical,
  Leaf,
  Medal,
  Shield,
  Truck,
} from 'lucide-react'

import { CERTIFICATION_COVERAGE } from '../content'

const CERT_ICONS = [Shield, Leaf, FlaskConical, Medal, Flag, Truck]

export function CertificationCoverage() {
  // Duplicate items for seamless loop
  const items = [...CERTIFICATION_COVERAGE, ...CERTIFICATION_COVERAGE]

  return (
    <div className="border-y border-hairline overflow-hidden">
      <div
        className="flex animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none whitespace-nowrap"
        aria-hidden="true"
      >
        {items.map((cert, index) => {
          const Icon = CERT_ICONS[index % CERT_ICONS.length]
          return (
            <span
              key={index}
              className="type-mono-meta text-ink-soft inline-flex items-center gap-2.5 px-8 py-5 shrink-0"
            >
              <Icon className="size-4 text-brand shrink-0" aria-hidden="true" />
              {cert.title}
            </span>
          )
        })}
      </div>
      {/* Accessible fallback for screen readers and reduced-motion users */}
      <ul className="sr-only">
        {CERTIFICATION_COVERAGE.map((cert) => (
          <li key={cert.title}>{cert.title}</li>
        ))}
      </ul>
    </div>
  )
}
