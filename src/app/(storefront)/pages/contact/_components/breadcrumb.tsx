import Link from 'next/link'

export function Breadcrumb() {
  return (
    <nav className="type-body-sm mb-8" aria-label="Breadcrumb">
      <ol className="text-muted flex items-center gap-2">
        <li>
          <Link
            href="/"
            className="focus-visible:ring-ring hover:text-default rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-default" aria-current="page">
          Contact
        </li>
      </ol>
    </nav>
  )
}
