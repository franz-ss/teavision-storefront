import { Section } from '@/components/ui'

import { LoginPanel, type LoginReason } from '../_components/login-panel'
import { getAccountLoginStartHref } from '../_lib/return-path'

type LoginPageProps = {
  searchParams: Promise<{
    reason?: string
    returnTo?: string
  }>
}

function getLoginReason(reason: string | undefined): LoginReason {
  if (reason === 'expired') return 'expired'
  if (reason === 'verification-failed') return 'verification-failed'

  return 'default'
}

export default async function AccountLoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams

  return (
    <Section.Root tone="surface" spacing="default">
      <Section.Container variant="compact">
        <LoginPanel
          loginHref={getAccountLoginStartHref(params.returnTo ?? null)}
          reason={getLoginReason(params.reason)}
        />
      </Section.Container>
    </Section.Root>
  )
}
