const clientDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

type CaptureRouterTransitionStart = (
  href: string,
  navigationType: string,
) => void

let captureRouterTransitionStart: CaptureRouterTransitionStart | undefined

if (clientDsn) {
  // Dynamic import keeps the ~142KB Sentry browser SDK out of the cold
  // first-load JS for every route when no DSN is configured (real-PSI
  // "Reduce unused JavaScript" + "Legacy JavaScript" findings on /).
  import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.init({
        dsn: clientDsn,
        environment: process.env.SENTRY_ENVIRONMENT,
        release: process.env.SENTRY_RELEASE,
        sendDefaultPii: false,
        tracesSampleRate: 0,
        enableLogs: false,
      })
      captureRouterTransitionStart = Sentry.captureRouterTransitionStart
    })
    .catch((error: unknown) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to initialize Sentry client SDK', error)
      }
    })
}

// Router transitions that fire before the dynamic import above resolves are
// not captured — an accepted tradeoff versus shipping the SDK eagerly on
// every route. Once Sentry has loaded, transitions delegate normally.
export const onRouterTransitionStart: CaptureRouterTransitionStart = (
  href,
  navigationType,
) => {
  captureRouterTransitionStart?.(href, navigationType)
}
