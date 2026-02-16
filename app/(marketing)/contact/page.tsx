export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-600">Talk to us or request a demo.</p>

      <form className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
        <input className="w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="Name" />
        <input className="w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="Email" />
        <input className="w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="Trade (e.g. plumber)" />
        <textarea className="w-full rounded-lg border border-gray-200 px-4 py-3" rows={4} placeholder="How can we help?" />
        <button className="rounded-lg bg-[#2F6BFF] px-5 py-3 text-sm font-medium text-white hover:bg-[#2557D6]">
          Send
        </button>
      </form>
    </div>
  )
}