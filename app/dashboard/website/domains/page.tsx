import { redirect } from 'next/navigation'
import { addDomain, deleteDomain, getDomains, verifyDomain } from '@/lib/website/domains'

export default async function WebsiteDomainsPage() {
  const domains = await getDomains()

  async function handleAdd(formData: FormData) {
    'use server'
    const domain = String(formData.get('domain') || '').trim()
    if (!domain) return
    await addDomain(domain)
    redirect('/dashboard/website/domains')
  }

  async function handleDelete(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    await deleteDomain(id)
    redirect('/dashboard/website/domains')
  }

  async function handleVerify(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    await verifyDomain(id)
    redirect('/dashboard/website/domains')
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Domains</h2>
      <p className="mt-2 text-sm text-gray-600">
        Add a custom domain and verify it.
      </p>

      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <div className="font-medium">DNS setup (example)</div>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li><strong>A</strong> record: <code>@</code> → <code>76.76.21.21</code></li>
          <li><strong>CNAME</strong> record: <code>www</code> → <code>cname.novatrades.app</code></li>
          <li><strong>TXT</strong> record: <code>@</code> → <code>nova-verify=YOUR_TOKEN</code></li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          Replace values with the ones shown for your domain once verification is enabled.
        </p>
      </div>

      <form action={handleAdd} className="mt-4 flex gap-2">
        <input
          name="domain"
          placeholder="example.com"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
        >
          Add
        </button>
      </form>

      <div className="mt-4 space-y-2 text-sm">
        {domains.length === 0 ? (
          <p className="text-gray-600">No domains added yet.</p>
        ) : (
          domains.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-2"
            >
              <div>
                <div className="font-medium">{d.domain}</div>
                <div className="text-xs text-gray-500">Status: {d.status}</div>
                {d.verification_token && (
                  <div className="mt-1 text-xs text-gray-500">
                    TXT: <code>nova-verify={d.verification_token}</code>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {d.status !== 'verified' && (
                  <form action={handleVerify}>
                    <input type="hidden" name="id" value={d.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Verify
                    </button>
                  </form>
                )}
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={d.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}