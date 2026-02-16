import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createPage, deletePage, getSitePages } from '@/lib/website/content'

export default async function WebsitePagesListPage() {
  const pages = await getSitePages()

  async function handleAddPage(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '').trim()
    if (!title) return
    const created = await createPage(title)
    if (created?.slug) {
      redirect(`/dashboard/website/pages/${created.slug}`)
    }
  }

  async function handleDeletePage(formData: FormData) {
    'use server'
    const pageId = String(formData.get('pageId') || '')
    if (!pageId) return
    await deletePage(pageId)
    redirect('/dashboard/website/pages')
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
      <form action={handleAddPage} className="mt-4 flex gap-2">
        <label htmlFor="page-title" className="sr-only">New page title</label>
        <input
          id="page-title"
          name="title"
          placeholder="New page title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
        >
          Add page
        </button>
      </form>
      <div className="mt-4 space-y-2 text-sm">
        {pages.length === 0 ? (
          <p className="text-gray-600">No pages yet.</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-2"
            >
              <Link className="flex-1 text-gray-900 hover:underline" href={`/dashboard/website/pages/${page.slug}`}>
                {page.title}
              </Link>
              <form action={handleDeletePage}>
                <input type="hidden" name="pageId" value={page.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
