import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'

export interface SiteSettings {
  id: string
  site_id: string
  seo_title: string | null
  seo_description: string | null
  analytics_id: string | null
}

export async function getOrCreateSettings() {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return null

  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, site_id, seo_title, seo_description, analytics_id')
    .eq('site_id', site.id)
    .maybeSingle()

  if (existing) return existing as SiteSettings

  const { data: created } = await supabase
    .from('site_settings')
    .insert({ site_id: site.id })
    .select('id, site_id, seo_title, seo_description, analytics_id')
    .single()

  return created as SiteSettings
}

export async function updateSettings(input: {
  seo_title?: string | null
  seo_description?: string | null
  analytics_id?: string | null
}) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return

  await supabase
    .from('site_settings')
    .upsert(
      {
        site_id: site.id,
        seo_title: input.seo_title ?? null,
        seo_description: input.seo_description ?? null,
        analytics_id: input.analytics_id ?? null,
      },
      { onConflict: 'site_id' }
    )
}