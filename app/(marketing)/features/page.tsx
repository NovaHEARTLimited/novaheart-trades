export default function FeaturesPricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Features & Pricing</h1>
      <p className="mt-2 text-gray-600">Everything you need to run your trade like a pro.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          'Quotes & estimates',
          'Job scheduling',
          'Invoice & payments',
          'Customer CRM',
          'Photo notes',
          'Team access',
        ].map((f) => (
          <div key={f} className="rounded-xl border border-gray-100 bg-white p-6">
            <h3 className="font-semibold">{f}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Placeholder copy tailored to UK trades.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          ['Starter', '£19/mo', 'For solo trades'],
          ['Pro', '£39/mo', 'For growing teams'],
          ['Business', '£79/mo', 'Multi-team'],
        ].map(([plan, price, blurb]) => (
          <div key={plan} className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-lg font-semibold">{plan}</h3>
            <p className="mt-1 text-2xl font-bold text-[#2F6BFF]">{price}</p>
            <p className="mt-2 text-sm text-gray-600">{blurb}</p>
            <button className="mt-4 w-full rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]">
              Choose {plan}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}