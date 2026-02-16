import { createClient } from '@/lib/supabase/server'

export interface SectionImage {
  id: string
  section_id: string
  image_url_draft: string | null
  image_url_published: string | null
  sort_order: number
}

export async function getSectionImages(sectionId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_section_images')
    .select('id, section_id, image_url_draft, image_url_published, sort_order')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: true })

  return (data ?? []) as SectionImage[]
}

export async function addSectionImage(sectionId: string, url: string) {
  const supabase = await createClient()

  const { data: last } = await supabase
    .from('site_section_images')
    .select('sort_order')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (last?.sort_order ?? 0) + 1

  await supabase
    .from('site_section_images')
    .insert({
      section_id: sectionId,
      image_url_draft: url,
      image_url_published: null,
      sort_order: sortOrder,
    })
}

export async function publishSectionImages(sectionId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_section_images')
    .select('id, image_url_draft')
    .eq('section_id', sectionId)

  if (!data) return

  await Promise.all(
    data.map((img) =>
      supabase
        .from('site_section_images')
        .update({ image_url_published: img.image_url_draft })
        .eq('id', img.id)
    )
  )
}

export async function deleteSectionImage(imageId: string) {
  const supabase = await createClient()
  await supabase.from('site_section_images').delete().eq('id', imageId)
}