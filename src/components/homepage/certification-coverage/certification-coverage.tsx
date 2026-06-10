import {
  Flag,
  FlaskConical,
  Leaf,
  Medal,
  Shield,
  Truck,
  type LucideIcon,
} from 'lucide-react'

// Six short certification strings from design data-layer.js:140,
// paired with the design's per-item icons (homepage.js CertsMarquee ics map)
const CERTS: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'ACO Certified Organic', icon: Shield },
  { label: 'USDA Organic', icon: Leaf },
  { label: 'HACCP Food Safety', icon: FlaskConical },
  { label: 'Golden Leaf Awards', icon: Medal },
  { label: 'Australian Made', icon: Flag },
  { label: 'Freight Insured', icon: Truck },
]

export function CertificationCoverage() {
  // Duplicate items for seamless -50% translateX loop
  const items = [...CERTS, ...CERTS]

  return (
    <div className="border-hairline overflow-hidden border-y">
      <div
        className="animate-marquee flex w-max items-center gap-16 py-7 hover:[animation-play-state:paused] motion-reduce:animate-none"
        aria-hidden="true"
      >
        {items.map((cert, index) => (
          <span
            key={index}
            className="text-ink-soft inline-flex shrink-0 items-center gap-3 font-mono text-[12px] tracking-[0.12em] uppercase"
          >
            <cert.icon
              className="text-brand size-6.5 shrink-0"
              aria-hidden="true"
              strokeWidth={1.6}
            />
            {cert.label}
          </span>
        ))}
      </div>
      {/* Accessible fallback for screen readers and reduced-motion users */}
      <ul className="sr-only">
        {CERTS.map((cert) => (
          <li key={cert.label}>{cert.label}</li>
        ))}
      </ul>
    </div>
  )
}
