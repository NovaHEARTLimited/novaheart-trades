import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'
import { publishSectionImages } from '@/lib/website/gallery'

export interface DbPage {
  id: string
  slug: string
  title: string
}

export interface DbSection {
  id: string
  name: string
  content: string
  content_draft: string
  content_published: string
  sort_order: number
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function getSitePages() {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return []

  const { data } = await supabase
    .from('site_pages')
    .select('id, slug, title')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })

  return (data ?? []) as DbPage[]
}

export async function getPageBySlug(slug: string) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return null

  const { data } = await supabase
    .from('site_pages')
    .select('id, slug, title')
    .eq('site_id', site.id)
    .eq('slug', slug)
    .maybeSingle()

  return data as DbPage | null
}

export async function getSectionsByPageId(pageId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_sections')
    .select('id, name, content, content_draft, content_published, sort_order')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  return (data ?? []) as DbSection[]
}

export async function updateSectionContent(sectionId: string, content: string) {
  const supabase = await createClient()

  await supabase
    .from('site_sections')
    .update({ content_draft: content })
    .eq('id', sectionId)
}

export async function publishPageSections(pageId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_sections')
    .select('id, content_draft, image_url_draft')
    .eq('page_id', pageId)

  if (!data || data.length === 0) return

  await Promise.all(
    data.map((s) => publishSectionImages(s.id))
  )

  const updates = data.map((s) => ({
    id: s.id,
    content_published: s.content_draft ?? '',
    image_url_published: s.image_url_draft ?? null,
  }))

  await supabase.from('site_sections').upsert(updates)
}

export async function seedStarterContent() {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return

  const { data: existing } = await supabase
    .from('site_pages')
    .select('id')
    .eq('site_id', site.id)
    .limit(1)

  if (existing && existing.length > 0) return

  const { data: pages } = await supabase
    .from('site_pages')
    .insert([
      { site_id: site.id, slug: 'home', title: 'Home' },
      { site_id: site.id, slug: 'about', title: 'About' },
      { site_id: site.id, slug: 'contact', title: 'Contact' },
    ])
    .select('id, slug')

  if (!pages) return

  const pageIdBySlug = Object.fromEntries(pages.map((p) => [p.slug, p.id]))

  await supabase.from('site_sections').insert([
    {
      page_id: pageIdBySlug.home,
      name: 'Hero',
      content: 'Welcome to NovaTrades.',
      content_draft: 'Welcome to NovaTrades.',
      content_published: 'Welcome to NovaTrades.',
      sort_order: 1,
    },
    {
      page_id: pageIdBySlug.home,
      name: 'Services',
      content: 'Plumbing, Electrical, HVAC.',
      content_draft: 'Plumbing, Electrical, HVAC.',
      content_published: 'Plumbing, Electrical, HVAC.',
      sort_order: 2,
    },
    {
      page_id: pageIdBySlug.home,
      name: 'Call to Action',
      content: 'Book a quote today.',
      content_draft: 'Book a quote today.',
      content_published: 'Book a quote today.',
      sort_order: 3,
    },
    {
      page_id: pageIdBySlug.about,
      name: 'Our Story',
      content: 'Built by local trades for local trades.',
      content_draft: 'Built by local trades for local trades.',
      content_published: 'Built by local trades for local trades.',
      sort_order: 1,
    },
    {
      page_id: pageIdBySlug.about,
      name: 'Values',
      content: 'Quality, reliability, trust.',
      content_draft: 'Quality, reliability, trust.',
      content_published: 'Quality, reliability, trust.',
      sort_order: 2,
    },
    {
      page_id: pageIdBySlug.contact,
      name: 'Contact Details',
      content: 'Phone, email, address.',
      content_draft: 'Phone, email, address.',
      content_published: 'Phone, email, address.',
      sort_order: 1,
    },
    {
      page_id: pageIdBySlug.contact,
      name: 'Contact Form',
      content: 'Name, email, message.',
      content_draft: 'Name, email, message.',
      content_published: 'Name, email, message.',
      sort_order: 2,
    },
  ])
}

export async function createPage(title: string, slug?: string) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return null

  const base = slugify(slug || title) || 'page'
  let finalSlug = base

  const { data: existing } = await supabase
    .from('site_pages')
    .select('id')
    .eq('site_id', site.id)
    .eq('slug', finalSlug)
    .maybeSingle()

  if (existing) {
    finalSlug = `${base}-${String(Date.now()).slice(-4)}`
  }

  const { data } = await supabase
    .from('site_pages')
    .insert({ site_id: site.id, title, slug: finalSlug })
    .select('id, slug, title')
    .single()

  return data
}

export async function createSection(pageId: string, name: string) {
  const supabase = await createClient()

  const { data: last } = await supabase
    .from('site_sections')
    .select('sort_order')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (last?.sort_order ?? 0) + 1

  const { data } = await supabase
    .from('site_sections')
    .insert({
      page_id: pageId,
      name,
      content: '',
      content_draft: '',
      content_published: '',
      sort_order: sortOrder,
    })
    .select('id, name, content, content_draft, content_published, sort_order')
    .single()

  return data
}

export async function deletePage(pageId: string) {
  const supabase = await createClient()
  await supabase.from('site_pages').delete().eq('id', pageId)
}

export async function deleteSection(sectionId: string) {
  const supabase = await createClient()
  await supabase.from('site_sections').delete().eq('id', sectionId)
}

export async function moveSection(sectionId: string, direction: 'up' | 'down') {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('site_sections')
    .select('id, page_id, sort_order')
    .eq('id', sectionId)
    .maybeSingle()

  if (!current) return

  const neighborQuery = supabase
    .from('site_sections')
    .select('id, sort_order')
    .eq('page_id', current.page_id)

  const { data: neighbor } =
    direction === 'up'
      ? await neighborQuery
          .lt('sort_order', current.sort_order)
          .order('sort_order', { ascending: false })
          .limit(1)
          .maybeSingle()
      : await neighborQuery
          .gt('sort_order', current.sort_order)
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle()

  if (!neighbor) return

  await supabase
    .from('site_sections')
    .update({ sort_order: neighbor.sort_order })
    .eq('id', current.id)

  await supabase
    .from('site_sections')
    .update({ sort_order: current.sort_order })
    .eq('id', neighbor.id)
}

export async function updateSectionOrder(pageId: string, orderedIds: string[]) {
  const supabase = await createClient()

  const updates = orderedIds.map((id, index) => ({
    id,
    page_id: pageId,
    sort_order: index + 1,
  }))

  await Promise.all(
    updates.map((u) =>
      supabase.from('site_sections').update({ sort_order: u.sort_order }).eq('id', u.id)
    )
  )
}

export async function removeSectionImageDraft(sectionId: string) {
  const supabase = await createClient()
  await supabase
    .from('site_sections')
    .update({ image_url_draft: null })
    .eq('id', sectionId)
}

export async function removeSectionImagePublished(sectionId: string) {
  const supabase = await createClient()
  await supabase
    .from('site_sections')
    .update({ image_url_published: null })
    .eq('id', sectionId)
}