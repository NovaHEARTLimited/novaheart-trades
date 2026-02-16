import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOrCreateSite } from '@/lib/website/site'

export default async function WebsiteOverviewPage() {
  const site = await getOrCreateSite()
  const status = site?.setup_status ?? 'not_started'

  if (status !== 'published') {
    redirect('/dashboard/website/setup')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Website status</h2>
        <p className="mt-2 text-sm text-gray-600">Current status: {status}</p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/dashboard/website/setup"
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
          >
            Start setup
          </Link>
          <Link
            href="/dashboard/website/templates"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Browse templates
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-md font-semibold">Checklist</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
          <li>Choose a template</li>
          <li>Add brand details</li>
          <li>Edit homepage content</li>
          <li>Preview and publish</li>
        </ul>
      </div>
    </div>
  )
}