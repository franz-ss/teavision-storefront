import { Leaf } from 'lucide-react'

// Six short certification strings from design data-layer.js:140
const CERT_STRINGS = [
  'ACO Certified Organic',
  'USDA Organic',
  'HACCP Food Safety',
  'Golden Leaf Awards',
  'Australian Made',
  'Freight Insured',
]

export function CertificationCoverage() {
  // Duplicate items for seamless -50% translateX loop
  const items = [...CERT_STRINGS, ...CERT_STRINGS]

  return (
    <div className="border-y border-hairline overflow-hidden">
      <div
        className="flex w-max animate-marquee items-center gap-16 py-7 hover:[animation-play-state:paused] motion-reduce:animate-none"
        aria-hidden="true"
      >
        {items.map((cert, index) => (
          <span
            key={index}
            className="inline-flex shrink-0 items-center gap-3 font-mono text-[12px] tracking-[0.12em] uppercase text-ink-soft"
          >
            <Leaf className="size-6.5 shrink-0 text-brand" aria-hidden="true" />
            {cert}
          </span>
        ))}
      </div>
      {/* Accessible fallback for screen readers and reduced-motion users */}
      <ul className="sr-only">
        {CERT_STRINGS.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    </div>
  )
}
