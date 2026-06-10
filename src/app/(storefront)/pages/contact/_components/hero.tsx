import { Badge, Eyebrow, Section } from '@/components/ui'

import { SUPPLY_CUES } from '../_lib/page-data'

export function Hero() {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <div className="flex flex-col justify-center">
          <Eyebrow tone="gold">Teavision procurement desk</Eyebrow>
          <h1 className="type-display text-paper mt-5 max-w-[16ch] text-balance">
            Let&rsquo;s talk supply.
          </h1>
          <p className="type-lede text-paper/85 mt-6 max-w-[54ch]">
            Speak with the team behind wholesale tea, herbs, spices, custom
            blending, and private label supply for Australian food and beverage
            businesses.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" role="list">
            {SUPPLY_CUES.map((cue) => (
              <li key={cue}>
                <Badge variant="onDark" label={cue} />
              </li>
            ))}
          </ul>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
