import { createClient } from '@/lib/supabase/server'

export type SiteStatus = 'not_started' | 'in_progress' | 'published'

export interface SiteState {
  id: string
  user_id: string
  template_id: string | null
  setup_status: SiteStatus
}

export async function getOrCreateSite(): Promise<SiteState | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('getOrCreateSite: No user')
    return null
  }

  console.log('getOrCreateSite: User ID:', user.id)

  const { data: existing, error: selectError } = await supabase
    .from('sites')
    .select('id, user_id, template_id, setup_status')
    .eq('user_id', user.id)
    .maybeSingle()

  console.log('getOrCreateSite: Existing site:', existing)
  console.log('getOrCreateSite: Select error:', selectError)

  if (existing) return existing as SiteState

  console.log('getOrCreateSite: Creating new site...')

  const { data: created, error: insertError } = await supabase
    .from('sites')
    .insert({ user_id: user.id, setup_status: 'not_started' })
    .select('id, user_id, template_id, setup_status')
    .single()

  console.log('getOrCreateSite: Created site:', created)
  console.log('getOrCreateSite: Insert error:', insertError)

  return created as SiteState
}

export async function setSiteTemplate(templateId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('sites')
    .upsert(
      {
        user_id: user.id,
        template_id: templateId,
        setup_status: 'in_progress',
      },
      { onConflict: 'user_id' }
    )
}

export async function setSiteStatus(status: SiteStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('sites')
    .upsert({ user_id: user.id, setup_status: status }, { onConflict: 'user_id' })
}

export async function publishSite() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('sites')
    .upsert(
      {
        user_id: user.id,
        setup_status: 'published',
        published_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
}

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function updateSiteSlug(input: string) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return { ok: false, message: 'No site found.' }

  const slug = normalizeSlug(input)
  if (!slug) return { ok: false, message: 'Invalid slug.' }

  const { data: existing } = await supabase
    .from('sites')
    .select('id')
    .eq('site_slug', slug)
    .neq('id', site.id)
    .maybeSingle()

  if (existing) {
    return { ok: false, message: 'Slug already in use.' }
  }

  await supabase.from('sites').update({ site_slug: slug }).eq('id', site.id)
  return { ok: true, slug }
}
