import {
  Button,
  ButtonProps,
  Section,
  type SectionIntroProps,
  type SectionRootProps,
} from '@/components/ui'

export interface CtaProps {
  tone?: SectionRootProps['tone']
  intro: SectionIntroProps
  cta: ButtonProps
}

export function Cta({ tone, intro, cta }: CtaProps) {
  return (
    <Section.Root tone={tone}>
      <Section.Container>
        <Section.Intro {...intro} />

        {cta ? (
          <div className="mt-8 flex justify-center">
            <Button {...cta} />
          </div>
        ) : null}
      </Section.Container>
    </Section.Root>
  )
}
