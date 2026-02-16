import Link from 'next/link'
import { getSitePages, getPageBySlug, getSectionsByPageId } from '@/lib/website/content'
import { createClient } from '@/lib/supabase/server'

async function getSiteSlug(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('sites')
    .select('slug')
    .eq('user_id', user.id)
    .maybeSingle()
  return data?.slug ?? null
}

export default async function WebsiteContentPage() {
  const [pages, siteSlug] = await Promise.all([getSitePages(), getSiteSlug()])
  const home = await getPageBySlug('home')
  const sections = home ? await getSectionsByPageId(home.id) : []
  const previewUrl: string | null = siteSlug ? `/site/${siteSlug}` : null

  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Content Editor</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select a page to edit its sections</p>
          </div>
          {previewUrl !== null && (
            <Link
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              View Live Site
            </Link>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.length === 0 ? (
            <p className="text-sm text-gray-500 col-span-3">
              No pages yet.{' '}
              <Link href="/dashboard/website/pages" className="text-[#2F6BFF] hover:underline">
                Add your first page
              </Link>
            </p>
          ) : (
            pages.map((page) => (
              <Link
                key={page.id}
                href={`/dashboard/website/pages/${page.slug}`}
                className="group rounded-xl border border-gray-200 p-4 hover:border-[#2F6BFF] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 group-hover:text-[#2F6BFF] transition-colors">
                    {page.title}
                  </span>
                  <span className="text-[#2F6BFF] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    Edit
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {sections.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Home Page Sections</h3>
            <Link href="/dashboard/website/pages/home" className="text-xs text-[#2F6BFF] hover:underline">
              Edit all
            </Link>
          </div>
          <div className="space-y-2">
            {sections.map((section) => (
              <Link
                key={section.id}
                href="/dashboard/website/pages/home"
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:border-[#2F6BFF] hover:bg-blue-50/40 transition-all group"
              >
                <div>
                  <div className="text-sm font-medium text-gray-800">{section.name}</div>
                  <div className="text-xs text-gray-400 truncate max-w-sm mt-0.5">
                    {section.content_draft || section.content || 'No content yet'}
                  </div>
                </div>
                <span className="text-xs text-[#2F6BFF] opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {previewUrl !== null && (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
            <Link
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2F6BFF] hover:underline"
            >
              Open full screen
            </Link>
          </div>
          <iframe
            src={previewUrl}
            className="w-full border-0"
            title="Live site preview"
            style={{ height: '600px', display: 'block' }}
          />
        </div>
      )}

    </div>
  )
}
