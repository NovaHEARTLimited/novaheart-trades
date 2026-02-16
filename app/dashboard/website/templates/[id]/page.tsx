import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { applyTemplate, getTemplateById } from '@/lib/website/templates'

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const template = getTemplateById(id)
  if (!template) notFound()

  async function handleApply(formData: FormData) {
    'use server'
    const templateId = String(formData.get('templateId') || '')
    if (!templateId) return
    await applyTemplate(templateId, true)
    redirect('/dashboard/website/pages')
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Preview pages and sections before applying.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/website/templates"
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
          <form action={handleApply}>
            <input type="hidden" name="templateId" value={template.id} />
            <button
              type="submit"
              className="rounded-lg bg-[#2F6BFF] px-3 py-2 text-xs font-medium text-white hover:bg-[#2557D6]"
            >
              Apply template
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {template.pages.map((page) => (
          <div key={page.slug} className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium">{page.title}</div>
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              {page.sections.map((s) => (
                <div key={s.name} className="rounded-md border border-gray-100 p-3">
                  <div className="text-xs font-semibold text-gray-500">{s.name}</div>
                  <p className="mt-1">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}