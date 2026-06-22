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
      padding="md"
      radius="lg"
      tone="surface"
      className="mx-auto grid w-full max-w-md gap-5"
    >
      <div className="grid gap-2">
        <p className="type-label text-brand">Account sign-in</p>
        <h1 className="type-heading-04 text-ink">Welcome back</h1>
        <p className="type-body-sm text-ink-soft">{reasonCopy[reason]}</p>
      </div>

      <div className="grid gap-2.5">
        <Button href={loginHref} variant="primary" size="md" className="w-full">
          Sign in with Shopify
        </Button>
        <Button
          href="/collections/all"
          variant="secondary"
          size="md"
          className="w-full"
        >
          Continue shopping
        </Button>
      </div>

      <p className="type-caption text-ink-faint">
        Secure account access is handled by Shopify.
      </p>
    </Card>
  )
}
