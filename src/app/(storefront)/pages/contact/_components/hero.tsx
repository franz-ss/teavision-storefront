import { Section } from '@/components/ui'

import { SUPPLY_CUES } from '../_lib/page-data'

export function Hero() {
  return (
    <Section.Root tone="sunken" className="border-default border-y">
      <Section.Container className="max-w-4xl">
        <div className="flex flex-col justify-center">
          <p className="text-muted type-eyebrow">Teavision procurement desk</p>
          <h1 className="type-display-01 mt-5 max-w-3xl text-balance">
            Let&rsquo;s talk supply.
          </h1>
          <p className="text-muted type-body mt-6 max-w-2xl">
            Speak with the team behind wholesale tea, herbs, spices, custom
            blending, and private label supply for Australian food and beverage
            businesses.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" role="list">
            {SUPPLY_CUES.map((cue) => (
              <li
                key={cue}
                className="type-label border-default bg-canvas rounded border px-3 py-2"
              >
                {cue}
              </li>
            ))}
          </ul>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
