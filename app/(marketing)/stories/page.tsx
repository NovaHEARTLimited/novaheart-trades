export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Testimonials & FAQ</h1>
      <p className="mt-2 text-gray-600">Real results for real trades.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[
          ['“Quotes go out in minutes now.”', 'James, Electrician — Bristol'],
          ['“Clients pay faster because it looks pro.”', 'Sophie, Builder — Leeds'],
        ].map(([quote, name]) => (
          <div key={name} className="rounded-xl border border-gray-100 bg-white p-6">
            <p className="text-gray-800">{quote}</p>
            <p className="mt-3 text-sm text-gray-600">{name}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4">
        {[
          ['Can I use it on my phone?', 'Yes — fully mobile-first.'],
          ['Does it work for any trade?', 'Yes — built for all UK trades.'],
          ['Can I send branded quotes?', 'Yes — logo, colours, and details.'],
        ].map(([q, a]) => (
          <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
            <p className="font-semibold">{q}</p>
            <p className="mt-2 text-sm text-gray-600">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}