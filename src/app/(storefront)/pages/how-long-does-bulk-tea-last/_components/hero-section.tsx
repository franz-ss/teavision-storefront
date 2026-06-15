import { Badge, Eyebrow, Section } from '@/components/ui'

import { HERO } from '../_lib/data'

export function HeroSection() {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <div className="max-w-3xl">
          <Eyebrow tone="gold">{HERO.eyebrow}</Eyebrow>
          <h1 className="type-display text-paper mt-5 text-balance">
            {HERO.title}
          </h1>
          <div className="mt-6 max-w-[58ch] space-y-4">
            {HERO.lede.map((paragraph) => (
              <p key={paragraph} className="type-lede text-paper/85">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {HERO.badges.map((badge) => (
              <Badge key={badge} variant="onDark" label={badge} />
            ))}
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
