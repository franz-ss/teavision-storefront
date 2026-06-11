import { Button, Section } from '@/components/ui'

export function BannerSection() {
  return (
    <Section.Root tone="inverse" spacing="none">
      <Section.Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-10">
        <div>
          <h2 className="type-label text-paper">BULK WHOLESALE ACCOUNT</h2>
          <p className="type-body-sm text-paper/85 mt-1">
            Access 1500+ Ingredients Direct from Farms and Save
          </p>
        </div>
        <Button
          href="/pages/wholesale"
          variant="inverse"
          size="sm"
        >
          Apply Now
        </Button>
      </Section.Container>
    </Section.Root>
  )
}
