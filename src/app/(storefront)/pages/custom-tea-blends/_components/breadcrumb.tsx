import Link from 'next/link'

export function Breadcrumb() {
  return (
    <nav className="type-body-sm text-muted mb-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2" role="list">
        <li>
          <Link
            href="/"
            className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-default" aria-current="page">
          Custom tea blends
        </li>
      </ol>
    </nav>
  )
}
