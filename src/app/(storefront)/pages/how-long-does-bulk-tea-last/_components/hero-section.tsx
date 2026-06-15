import { Badge, Eyebrow, Section } from '@/components/ui'

import { HERO } from '../_lib/data'

export function HeroSection() {
  return (
    <Section.Root tone="brand">
      <Section.Container variant="base">
        <Eyebrow tone="gold">{HERO.eyebrow}</Eyebrow>
        <h1 className="type-display text-paper mt-5 max-w-[20ch] text-balance">
          {HERO.title}
        </h1>
        <div className="mt-8 grid max-w-5xl gap-x-12 gap-y-4 md:grid-cols-2">
          {HERO.lede.map((paragraph) => (
            <p key={paragraph} className="type-lede text-paper/85">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap gap-2">
          {HERO.badges.map((badge) => (
            <Badge key={badge} variant="onDark" label={badge} />
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
