import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Australia&rsquo;s #1 Tea Supplier
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Bulk wholesale tea, herbs, and spices for cafes, restaurants, and
          retailers.
        </p>
        <a
          href="/collections/all"
          className="mt-8 inline-block rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Shop All Products
        </a>
      </section>

      {/* Featured collections placeholder */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Shop by Category</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" role="list">
            {['Black Tea', 'Green Tea', 'Herbs & Spices', 'Custom Blends'].map(
              (name) => (
                <li key={name}>
                  <a
                    href="#"
                    className="block rounded border p-6 text-center font-medium hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {name}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Featured products placeholder */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <a
                  href="#"
                  className="group block focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <div
                    className="aspect-square rounded bg-gray-200"
                    aria-hidden="true"
                  />
                  <p className="mt-2 font-medium group-hover:underline">
                    Product Placeholder {i}
                  </p>
                  <p className="text-sm text-gray-500">$0.00</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
