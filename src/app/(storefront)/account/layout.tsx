import type { ReactNode } from 'react'

import { Section } from '@/components/ui'

type AccountLayoutProps = {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <Section.Root
      tone="surface"
      spacing="compact"
      className="min-h-[34rem] md:min-h-[32rem]"
    >
      <Section.Container>{children}</Section.Container>
    </Section.Root>
  )
}
