import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'

export interface SiteTheme {
  id: string
  site_id: string
  primary_color: string
  font_family: string
  logo_url: string | null
}

export async function getOrCreateTheme() {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return null

  const { data: existing } = await supabase
    .from('site_theme')
    .select('id, site_id, primary_color, font_family, logo_url')
    .eq('site_id', site.id)
    .maybeSingle()

  if (existing) return existing as SiteTheme

  const { data: created } = await supabase
    .from('site_theme')
    .insert({ site_id: site.id })
    .select('id, site_id, primary_color, font_family, logo_url')
    .single()

  return created as SiteTheme
}

export async function updateTheme(input: {
  primary_color: string
  font_family: string
  logo_url?: string | null
}) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return

  await supabase
    .from('site_theme')
    .upsert(
      {
        site_id: site.id,
        primary_color: input.primary_color,
        font_family: input.font_family,
        logo_url: input.logo_url ?? null,
      },
      { onConflict: 'site_id' }
    )
}