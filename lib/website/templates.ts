import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'

export interface TemplateSection {
  name: string
  content: string
  sort_order: number
}

export interface TemplatePage {
  slug: string
  title: string
  sections: TemplateSection[]
}

export interface SiteTemplate {
  id: string
  name: string
  description: string
  accent: string
  pages: TemplatePage[]
}

export const TEMPLATES: SiteTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Trades',
    description: 'Clean and trustworthy. Great for established local tradespeople.',
    accent: 'from-blue-600 to-blue-400',
    pages: [
      {
        slug: 'home',
        title: 'Home',
        sections: [
          { name: 'Hero', content: 'Trusted local trades, done right.', sort_order: 1 },
          { name: 'Services', content: 'Plumbing, electrical, heating, and more.', sort_order: 2 },
          { name: 'Testimonials', content: 'Excellent service and fast turnaround.', sort_order: 3 },
          { name: 'Call to Action', content: 'Get a free quote today.', sort_order: 4 },
        ],
      },
      {
        slug: 'about',
        title: 'About',
        sections: [
          { name: 'Our Story', content: 'Local, reliable, and proud of our work.', sort_order: 1 },
          { name: 'Values', content: 'Quality, transparency, and trust.', sort_order: 2 },
        ],
      },
      {
        slug: 'contact',
        title: 'Contact',
        sections: [
          { name: 'Contact Details', content: 'Phone, email, address.', sort_order: 1 },
          { name: 'Contact Form', content: 'Name, email, message.', sort_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'modern',
    name: 'Modern Pro',
    description: 'Bold and professional. Ideal for growing trade businesses.',
    accent: 'from-violet-600 to-blue-500',
    pages: [
      {
        slug: 'home',
        title: 'Home',
        sections: [
          { name: 'Hero', content: 'Modern, clean, and professional trade services.', sort_order: 1 },
          { name: 'Why Us', content: 'Fully insured, certified, and reviewed.', sort_order: 2 },
          { name: 'Gallery', content: 'Recent work highlights.', sort_order: 3 },
        ],
      },
      {
        slug: 'services',
        title: 'Services',
        sections: [
          { name: 'Service List', content: 'Installations, repairs, maintenance.', sort_order: 1 },
          { name: 'Process', content: 'Book, Quote, Job, Done.', sort_order: 2 },
        ],
      },
      {
        slug: 'contact',
        title: 'Contact',
        sections: [
          { name: 'Contact Details', content: 'Phone, email, address.', sort_order: 1 },
        ],
      },
    ],
  },
]

export function getTemplateById(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? null
}

export async function applyTemplate(templateId: string, replaceExisting = true) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return

  const template = getTemplateById(templateId)
  if (!template) return

  if (replaceExisting) {
    await supabase.from('site_pages').delete().eq('site_id', site.id)
  } else {
    const { data: existing } = await supabase
      .from('site_pages')
      .select('id')
      .eq('site_id', site.id)
      .limit(1)

    if (existing && existing.length > 0) return
  }

  const { data: pages } = await supabase
    .from('site_pages')
    .insert(
      template.pages.map((p) => ({
        site_id: site.id,
        slug: p.slug,
        title: p.title,
      }))
    )
    .select('id, slug')

  if (!pages) return

  const pageIdBySlug = Object.fromEntries(pages.map((p) => [p.slug, p.id]))

  const sectionsPayload = template.pages.flatMap((p) =>
    p.sections.map((s) => ({
      page_id: pageIdBySlug[p.slug],
      name: s.name,
      content: s.content,
      content_draft: s.content,
      content_published: s.content,
      sort_order: s.sort_order,
    }))
  )

  await supabase.from('site_sections').insert(sectionsPayload)

  await supabase
    .from('sites')
    .update({ template_id: templateId, setup_status: 'in_progress' })
    .eq('id', site.id)
}
