import { Button, Card } from '@/components/ui'

export type LoginReason = 'expired' | 'verification-failed' | 'default'

type LoginPanelProps = {
  loginHref: string
  reason?: LoginReason
}

const reasonCopy: Record<LoginReason, string> = {
  default: 'Sign in to continue to your account.',
  expired: 'Your session has expired. Sign in again to continue.',
  'verification-failed':
    'We could not verify that sign-in. Start sign-in again.',
}

export function LoginPanel({ loginHref, reason = 'default' }: LoginPanelProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      tone="surface"
      className="mx-auto grid max-w-xl gap-6"
    >
      <div className="grid gap-3">
        <p className="type-mono-meta text-gold-deep">Customer account</p>
        <h1 className="type-heading-01 text-ink">Welcome back</h1>
        <p className="type-body text-ink-soft">{reasonCopy[reason]}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={loginHref} variant="brand" size="lg">
          Sign in with Shopify
        </Button>
        <Button href="/collections/all" variant="secondary" size="lg">
          Continue shopping
        </Button>
      </div>
    </Card>
  )
}
