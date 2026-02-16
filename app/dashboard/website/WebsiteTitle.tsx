'use client'

import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  website: 'Website',
  setup: 'Setup',
  templates: 'Templates',
  pages: 'Pages',
  content: 'Content',
  theme: 'Theme',
  domains: 'Domains',
  settings: 'Settings',
}

export default function WebsiteTitle() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const index = parts.indexOf('website')

  if (index === -1) return <h1 className="text-2xl font-bold">Website</h1>

  const next = parts[index + 1]
  const title = next ? TITLES[next] ?? 'Website' : 'Website'

  const isTemplatePreview =
    next === 'templates' && parts[index + 2] !== undefined
  const isPageEditor = next === 'pages' && parts[index + 2] !== undefined

  const finalTitle = isTemplatePreview
    ? 'Template Preview'
    : isPageEditor
    ? 'Edit Page'
    : title

  return <h1 className="text-2xl font-bold">{finalTitle}</h1>
}