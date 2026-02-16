import { createClient } from '@/lib/supabase/server'

export async function getPublicSiteBySlug(siteSlug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sites')
    .select('id, slug, setup_status, business_profile')
    .eq('slug', siteSlug)
    .maybeSingle()

  console.log('=== GET SITE BY SLUG ===')
  console.log('Looking for slug:', siteSlug)
  console.log('Found data:', data)
  console.log('Error:', error)

  return data
}

export async function getPublicTheme(siteId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_theme')
    .select('primary_color, font_family, logo_url')
    .eq('site_id', siteId)
    .maybeSingle()

  return data
}

export async function getPublicSettings(siteId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('seo_title, seo_description, analytics_id')
    .eq('site_id', siteId)
    .maybeSingle()

  return data
}

export async function getPublicPageBySlug(siteId: string, slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('site_pages')
    .select('id, slug, title')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .maybeSingle()

  console.log('=== GET PAGE BY SLUG ===')
  console.log('Site ID:', siteId)
  console.log('Page slug:', slug)
  console.log('Found data:', data)
  console.log('Error:', error)

  return data
}

export async function getPublicPages(siteId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_pages')
    .select('id, slug, title')
    .eq('site_id', siteId)
    .order('slug', { ascending: true })

  return data ?? []
}

export async function getPublicSectionsByPageId(pageId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_sections')
    .select('id, name, content_published, image_url_published, sort_order')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  return data ?? []
}

export async function getPublicSiteByDomain(domain: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_domains')
    .select('domain, status, site_id, sites!inner(slug, setup_status)')
    .eq('domain', domain)
    .eq('status', 'verified')
    .maybeSingle()

  if (!data?.sites?.[0]?.slug) return null
  return { slug: data.sites[0].slug as string }
}
