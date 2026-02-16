import { redirect } from 'next/navigation'
import { getOrCreateTheme, updateTheme } from '@/lib/website/theme'

export default async function WebsiteThemePage() {
  const theme = await getOrCreateTheme()

  async function handleSave(formData: FormData) {
    'use server'
    const primary_color = String(formData.get('primary_color') || '#2F6BFF')
    const font_family = String(formData.get('font_family') || 'Inter')
    const logo_url = String(formData.get('logo_url') || '')
    await updateTheme({
      primary_color,
      font_family,
      logo_url: logo_url || null,
    })
    redirect('/dashboard/website/theme')
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Theme</h2>
      <p className="mt-2 text-sm text-gray-600">
        Configure colors, fonts, and branding.
      </p>

      <form action={handleSave} className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Primary color</label>
          <input
            name="primary_color"
            type="color"
            defaultValue={theme?.primary_color ?? '#2F6BFF'}
            className="mt-2 h-10 w-24 rounded-md border border-gray-200"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Font family</label>
          <input
            name="font_family"
            defaultValue={theme?.font_family ?? 'Inter'}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Logo URL</label>
          <input
            name="logo_url"
            defaultValue={theme?.logo_url ?? ''}
            placeholder="https://..."
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
        >
          Save theme
        </button>
      </form>
    </div>
  )
}