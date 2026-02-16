import { redirect } from 'next/navigation'
import { getOrCreateSettings, updateSettings } from '@/lib/website/settings'
import { getOrCreateSite, updateSiteSlug } from '@/lib/website/site'

export default async function WebsiteSettingsPage() {
  const settings = await getOrCreateSettings()
  const site = await getOrCreateSite()

  async function handleSave(formData: FormData) {
    'use server'
    const seo_title = String(formData.get('seo_title') || '')
    const seo_description = String(formData.get('seo_description') || '')
    const analytics_id = String(formData.get('analytics_id') || '')
    await updateSettings({
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      analytics_id: analytics_id || null,
    })
    redirect('/dashboard/website/settings')
  }

  async function handleSlug(formData: FormData) {
    'use server'
    const slug = String(formData.get('site_slug') || '')
    if (!slug) return
    await updateSiteSlug(slug)
    redirect('/dashboard/website/settings')
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Site settings</h2>
      <p className="mt-2 text-sm text-gray-600">
        Manage SEO and analytics.
      </p>

      <form action={handleSlug} className="mt-4 space-y-2">
        <label className="text-sm font-medium">Site URL</label>
        <div className="flex gap-2">
          <input
            name="site_slug"
            defaultValue={site?.id ?? ''}
            placeholder="your-business"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            Update URL
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Public: {site?.id ? `/site/${site.id}` : '/site/your-business'}
        </p>
      </form>

      <form action={handleSave} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">SEO title</label>
          <input
            name="seo_title"
            defaultValue={settings?.seo_title ?? ''}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">SEO description</label>
          <textarea
            name="seo_description"
            defaultValue={settings?.seo_description ?? ''}
            rows={3}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Analytics ID</label>
          <input
            name="analytics_id"
            defaultValue={settings?.analytics_id ?? ''}
            placeholder="G-XXXXXXXXXX"
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
        >
          Save settings
        </button>
      </form>
    </div>
  )
}