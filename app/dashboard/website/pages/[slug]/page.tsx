import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import SectionsOrderEditor from './SectionsOrderEditor'
import SectionContentEditor from '@/components/dashboard/SectionContentEditor'
import { uploadSiteAsset } from '@/lib/website/media'
import { createClient } from '@/lib/supabase/server'
import {
  createSection,
  deletePage,
  deleteSection,
  getPageBySlug,
  getSectionsByPageId,
  publishPageSections,
  updateSectionContent,
  updateSectionOrder,
} from '@/lib/website/content'
import { addSectionImage, deleteSectionImage, getSectionImages } from '@/lib/website/gallery'

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

export default async function WebsitePageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { slug } = await params
  const { view: viewParam } = await searchParams
  const view = viewParam === 'published' ? 'published' : 'draft'
  const [page, siteSlug] = await Promise.all([getPageBySlug(slug), getSiteSlug()])
  const previewUrl: string | null = siteSlug ? `/site/${siteSlug}` : null

  async function saveSection(sectionId: string, content: string) {
    'use server'
    await updateSectionContent(sectionId, content)
  }

  async function handleAddSection(formData: FormData) {
    'use server'
    const name = String(formData.get('name') || '').trim()
    const pageId = String(formData.get('pageId') || '')
    if (!name || !pageId) return
    await createSection(pageId, name)
    redirect(`/dashboard/website/pages/${slug}?view=${view}`)
  }

  async function handleDeleteSection(formData: FormData) {
    'use server'
    const sectionId = String(formData.get('sectionId') || '')
    if (!sectionId) return
    await deleteSection(sectionId)
    redirect(`/dashboard/website/pages/${slug}?view=${view}`)
  }

  async function handleDeletePage() {
    'use server'
    if (!page?.id) return
    await deletePage(page.id)
    redirect('/dashboard/website/pages')
  }

  async function handlePublishPage() {
    'use server'
    if (!page?.id) return
    await publishPageSections(page.id)
    redirect(`/dashboard/website/pages/${slug}?view=published`)
  }

  async function handleSaveOrder(formData: FormData) {
    'use server'
    if (!page?.id) return
    const raw = String(formData.get('orderedIds') || '')
    if (!raw) return
    const orderedIds = JSON.parse(raw) as string[]
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return
    await updateSectionOrder(page.id, orderedIds)
    redirect(`/dashboard/website/pages/${slug}?view=${view}`)
  }

  async function handleGalleryUpload(formData: FormData) {
    'use server'
    const sectionId = String(formData.get('sectionId') || '')
    const file = formData.get('image') as File | null
    if (!sectionId || !file || file.size === 0 || !page?.id) return
    const ext = file.type?.split('/')?.[1] ?? 'jpg'
    const path = `galleries/${page.id}/${sectionId}/${Date.now()}.${ext}`
    const url = await uploadSiteAsset(path, file)
    await addSectionImage(sectionId, url)
    redirect(`/dashboard/website/pages/${slug}?view=${view}`)
  }

  async function handleGalleryRemove(formData: FormData) {
    'use server'
    const imageId = String(formData.get('imageId') || '')
    if (!imageId) return
    await deleteSectionImage(imageId)
    redirect(`/dashboard/website/pages/${slug}?view=${view}`)
  }

  if (!page) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-gray-600">No page exists for: {slug}</p>
      </div>
    )
  }

  const sections = await getSectionsByPageId(page.id)

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Edit: {page.title}</h2>
          <div className="flex items-center gap-2">
            <Link
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                view === 'draft' ? 'border-[#2F6BFF] text-[#2F6BFF]' : 'border-gray-200 text-gray-600'
              }`}
              href={`/dashboard/website/pages/${slug}?view=draft`}
            >
              Draft
            </Link>
            <Link
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                view === 'published' ? 'border-[#2F6BFF] text-[#2F6BFF]' : 'border-gray-200 text-gray-600'
              }`}
              href={`/dashboard/website/pages/${slug}?view=published`}
            >
              Published
            </Link>
            <form action={handleDeletePage}>
              <button
                type="submit"
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete page
              </button>
            </form>
          </div>
        </div>

        <form action={handleAddSection} className="mt-4 flex gap-2">
          <input type="hidden" name="pageId" value={page.id} />
          <label htmlFor="section-name" className="sr-only">New section name</label>
          <input
            id="section-name"
            name="name"
            placeholder="New section name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
          >
            Add section
          </button>
        </form>

        {view === 'draft' && (
          <form action={handlePublishPage} className="mt-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
            >
              Publish draft changes
            </button>
          </form>
        )}

        <div className="mt-4">
          <SectionsOrderEditor sections={sections} onSave={handleSaveOrder} />
        </div>

        <div className="mt-4 space-y-4">
          {sections.length === 0 ? (
            <p className="text-sm text-gray-600">No sections yet.</p>
          ) : (
            sections.map(async (section) => {
              const value = view === 'published' ? section.content_published : section.content_draft
              const gallery = await getSectionImages(section.id)

              return (
                <div key={section.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">{section.name}</div>
                    <form action={handleDeleteSection}>
                      <input type="hidden" name="sectionId" value={section.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>

                  <SectionContentEditor
                    sectionId={section.id}
                    sectionName={section.name}
                    pageTitle={page.title}
                    initialValue={value}
                    isPublished={view === 'published'}
                    onSave={saveSection}
                  />

                  <div className="mt-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Gallery</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {gallery.length === 0 ? (
                        <div className="text-xs text-gray-400">No gallery images.</div>
                      ) : (
                        gallery.map((img) => (
                          <div key={img.id} className="space-y-2">
                            {(img.image_url_published || img.image_url_draft) && (
                              <Image
                                src={view === 'published' ? img.image_url_published ?? '' : img.image_url_draft ?? ''}
                                alt="Gallery"
                                width={300}
                                height={112}
                                className="h-28 w-full rounded-md border object-cover"
                              />
                            )}
                            {view === 'draft' && (
                              <form action={handleGalleryRemove}>
                                <input type="hidden" name="imageId" value={img.id} />
                                <button
                                  type="submit"
                                  className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                >
                                  Remove
                                </button>
                              </form>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {view === 'draft' && (
                      <form action={handleGalleryUpload} className="mt-3 flex items-center gap-2">
                        <input type="hidden" name="sectionId" value={section.id} />
                        <label htmlFor={`gallery-${section.id}`} className="sr-only">Upload gallery image</label>
                        <input
                          id={`gallery-${section.id}`}
                          name="image"
                          type="file"
                          accept="image/*"
                          className="text-sm text-gray-600"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Add to gallery
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {previewUrl !== null && (
        <div className="hidden xl:block">
          <div className="sticky top-6 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-700">Live Preview</span>
              <Link
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#2F6BFF] hover:underline"
              >
                Open full screen
              </Link>
            </div>
            <div className="relative overflow-hidden" style={{ height: '600px' }}>
              <iframe
                src={previewUrl}
                title="Live site preview"
                style={{
                  width: '1280px',
                  height: '900px',
                  transform: 'scale(0.296)',
                  transformOrigin: 'top left',
                  border: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">Reflects published content</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
