import { Button, Section } from '@/components/ui'

type CtaSectionProps = {
  title: string
  copy: string
}

export function CtaSection({ title, copy }: CtaSectionProps) {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="type-heading-01 text-paper max-w-[20ch] text-balance">
            {title}
          </h2>
          <p className="type-lede text-paper/80 max-w-[52ch]">{copy}</p>
          <div className="mt-2">
            <Button href="#need-help" variant="inverse" size="lg">
              Get Custom Quote
            </Button>
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
