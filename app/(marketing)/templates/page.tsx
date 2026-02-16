import Link from 'next/link'
import Image from 'next/image'
import { templates } from '@/lib/templates/registry'

interface Template {
  id: string
  name: string
  description: string
  image?: string
  tags?: string[]
}

export default function TemplatesPage() {
  if (!templates || templates.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold">No templates available</h1>
          <p className="mt-2 text-gray-600">
            Please check back later for available templates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Choose a website template</h1>
        <p className="mt-2 text-gray-600">
          Preview five styles and pick the one that fits your business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template: Template) => (
          <div
            key={template.id}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-40 overflow-hidden rounded-xl bg-linear-to-br from-gray-100 to-gray-200">
              {template.image ? (
                <Image
                  src={template.image}
                  alt={`${template.name} preview`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-gray-400">Preview</span>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{template.name}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
            {template.tags && template.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {template.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <Link
                href={`/templates/${template.id}`}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
              >
                Preview
              </Link>
              <Link
                href={`/onboarding?template=${template.id}`}
                className="flex-1 rounded-lg bg-[#2F6BFF] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#2557D6]"
              >
                Choose
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}