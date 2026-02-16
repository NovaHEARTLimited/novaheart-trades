export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Services (Trades)</h1>
      <p className="mt-2 text-gray-600">Built for every trade in construction.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          'Electricians',
          'Plumbers',
          'Builders',
          'Carpenters',
          'Painters & decorators',
          'Roofers',
          'Landscapers',
          'Plasterers',
          'HVAC',
        ].map((trade) => (
          <div key={trade} className="rounded-xl border border-gray-100 bg-white p-6">
            <h3 className="font-semibold">{trade}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Placeholder: key workflows for {trade.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}