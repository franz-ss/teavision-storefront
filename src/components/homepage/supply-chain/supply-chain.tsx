import { AnimatedElement, Button, Eyebrow, Section } from '@/components/ui'

export function SupplyChain() {
  return (
    <Section.Root tone="inverse" className="overflow-hidden">
      <Section.Container>
        {/* Narrow motif tracks + negative margins (same as newsletter band):
            images bleed past the content edge, the copy column gets wider */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,160px)]">
          <div className="flex justify-center lg:-ml-18">
            <AnimatedElement
              animation="float-primary"
              src="/images/business-handshake.png"
              width={678}
              height={594}
              className="w-[clamp(188px,23.5vw,252px)]"
              sizes="(min-width: 1024px) 252px, 40vw"
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold" className="mb-4 justify-center">
              For business
            </Eyebrow>
            <h2 className="type-heading-01 text-paper">
              Let the experts help <em className="text-gold italic">grow</em>{' '}
              your business
            </h2>
            <p className="type-lede text-paper/75 mt-4">
              Here at Teavision, we take pride in everything we do and
              we&apos;re always on a mission to source the best ingredients at
              the lowest prices. Our team of certified tea masters and
              herbalists are dedicated to helping your business grow and achieve
              it&apos;s goals.
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/pages/contact" variant="inverse" size="cta">
                Contact the team
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:-mr-20">
            <AnimatedElement
              animation="float-secondary"
              src="/images/business-stamp.png"
              width={562}
              height={567}
              className="w-[clamp(140px,14vw,200px)]"
              sizes="(min-width: 1024px) 200px, 30vw"
            />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
