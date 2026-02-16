import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { addSectionImage } from '@/lib/website/gallery'
import { uploadSiteAsset } from '@/lib/website/media'
import { assignDefaultTemplate, normalizeTradeCategory, type TradeCategory } from '@/lib/templates/contract'
import { getOrCreateSite } from '@/lib/website/site'
import SettingsTabs from '@/components/dashboard/SettingsTabs'

const tabs = [
  { id: 'business', label: 'Business Profile' },
  { id: 'hours', label: 'Business Hours' },
  { id: 'certifications', label: 'Accreditations' },
  { id: 'portfolio', label: 'Portfolio' },
]

const tradeOptions: Array<{ value: TradeCategory; label: string }> = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general_contracting', label: 'General Contracting' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'other', label: 'Other' },
]

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

function isRecord(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function ensureGallerySection(siteId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_sections')
    .select('id, name, page_id, site_pages!inner(site_id)')
    .eq('site_pages.site_id', siteId)
    .or('name.ilike.%gallery%,name.ilike.%portfolio%,name.ilike.%work%')
    .maybeSingle()

  if (data?.id) return data.id

  const { data: pages } = await supabase
    .from('site_pages')
    .select('id, slug')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true })

  const pageId = pages?.find((page) => page.slug === 'home')?.id ?? pages?.[0]?.id
  if (!pageId) return null

  const { data: created } = await supabase
    .from('site_sections')
    .insert({
      page_id: pageId,
      name: 'Our Work',
      content: 'Our Work',
      content_draft: 'Our Work',
      content_published: 'Our Work',
      sort_order: 1,
    })
    .select('id')
    .single()

  return created?.id ?? null
}

function hasMeaningfulHours(hours: Record<string, string>) {
  return Object.values(hours).some((value) => String(value).trim())
}

async function enforceTemplateLock(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: site } = await supabase
    .from('sites')
    .select('id, is_template_locked')
    .eq('user_id', userId)
    .maybeSingle()

  if (!site?.id) return { isComplete: false, galleryCount: 0 }

  const { data: profile } = await supabase
    .from('profiles')
    .select('trade_type, business_hours, accreditations')
    .eq('id', userId)
    .maybeSingle()

  const hours = isRecord(profile?.business_hours) ? profile?.business_hours : {}
  const hasTradeType = Boolean(profile?.trade_type)
  const hasHours = hasMeaningfulHours(hours)
  const hasAccreditations = Array.isArray(profile?.accreditations)
    ? profile?.accreditations.length > 0
    : false

  const sectionId = await ensureGallerySection(site.id)
  const { count } = sectionId
    ? await supabase
        .from('site_section_images')
        .select('id', { count: 'exact', head: true })
        .eq('section_id', sectionId)
    : { count: 0 }

  const galleryCount = count ?? 0
  const hasGallery = galleryCount >= 3
  const isComplete = hasTradeType && hasHours && hasAccreditations && hasGallery

  if (isComplete && !site.is_template_locked) {
    await supabase.from('sites').update({ is_template_locked: true }).eq('id', site.id)
  }

  return { isComplete, galleryCount, hasTradeType, hasHours, hasAccreditations }
}

export default async function DashboardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { tab } = await searchParams
  const activeTab = tabs.some((t) => t.id === tab) ? (tab as string) : 'business'

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, business_name, trade_type, business_hours, accreditations')
    .eq('id', user.id)
    .maybeSingle()

  let site = await supabase
    .from('sites')
    .select('id, is_template_locked, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!site.data) {
    await getOrCreateSite()
    site = await supabase
      .from('sites')
      .select('id, is_template_locked, slug')
      .eq('user_id', user.id)
      .maybeSingle()
  }

  const siteId = site.data?.id
  const gallerySectionId = siteId ? await ensureGallerySection(siteId) : null
  const liveSiteUrl = `/site/${site.data?.slug ?? siteId ?? ''}`

  const { data: portfolioImages } = gallerySectionId
    ? await supabase
        .from('site_section_images')
        .select('id, image_url_draft, image_url_published, sort_order')
        .eq('section_id', gallerySectionId)
        .order('sort_order', { ascending: true })
    : { data: [] }

  async function handleBusinessSave(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, message: 'No user found.' }

    const businessName = String(formData.get('business_name') || '')
    const tradeType = String(formData.get('trade_type') || '')

    await supabase
      .from('profiles')
      .upsert(
        { id: user.id, business_name: businessName || null, trade_type: tradeType || null },
        { onConflict: 'id' }
      )

    if (tradeType) {
      const site = await supabase
        .from('sites')
        .select('id, is_template_locked')
        .eq('user_id', user.id)
        .maybeSingle()

      if (site.data && !site.data.is_template_locked) {
        const templateId = assignDefaultTemplate(normalizeTradeCategory(tradeType))
        await supabase.from('sites').update({ template_id: templateId }).eq('id', site.data.id)
      }
    }

    const completion = await enforceTemplateLock(supabase, user.id)

    return {
      ok: true,
      hasTradeType: completion.hasTradeType ?? Boolean(tradeType),
      hasHours: completion.hasHours,
      hasAccreditations: completion.hasAccreditations,
      galleryCount: completion.galleryCount,
    }
  }

  async function handleHoursSave(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, message: 'No user found.' }

    const businessHours = days.reduce<Record<string, string>>((acc, day) => {
      acc[day.key] = String(formData.get(day.key) || '')
      return acc
    }, {})

    await supabase
      .from('profiles')
      .upsert({ id: user.id, business_hours: businessHours }, { onConflict: 'id' })

    const completion = await enforceTemplateLock(supabase, user.id)
    const hasHours = hasMeaningfulHours(businessHours)

    return {
      ok: true,
      hasHours: completion.hasHours ?? hasHours,
      hasTradeType: completion.hasTradeType,
      hasAccreditations: completion.hasAccreditations,
      galleryCount: completion.galleryCount,
    }
  }

  async function handleAccreditationsSave(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, message: 'No user found.' }

    const raw = String(formData.get('accreditations') || '[]')
    let accreditations: string[] = []

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) accreditations = parsed
    } catch {
      accreditations = []
    }

    await supabase
      .from('profiles')
      .upsert({ id: user.id, accreditations }, { onConflict: 'id' })

    const completion = await enforceTemplateLock(supabase, user.id)

    return {
      ok: true,
      hasAccreditations: completion.hasAccreditations ?? accreditations.length > 0,
      hasTradeType: completion.hasTradeType,
      hasHours: completion.hasHours,
      galleryCount: completion.galleryCount,
    }
  }

  async function handlePortfolioUpload(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, message: 'No user found.' }

    const site = await supabase
      .from('sites')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!site.data) return { ok: false, message: 'No site found.' }

    const sectionId = await ensureGallerySection(site.data.id)
    if (!sectionId) return { ok: false, message: 'No gallery section found.' }

    const files = formData.getAll('portfolio_images').filter(Boolean) as File[]
    const uploaded: Array<{ name: string; url: string }> = []

    for (const file of files) {
     const ext = file.type?.split('/')?.[1] ?? 'jpg'
const path = `sites/${site.data.id}/portfolio/${Date.now()}.${ext}`
const url = await uploadSiteAsset(path, file)
await addSectionImage(sectionId, url)
uploaded.push({ name: path.split('/').pop() ?? 'image', url })
    }

    const completion = await enforceTemplateLock(supabase, user.id)

    return {
      ok: true,
      uploaded,
      galleryCount: completion.galleryCount ?? 0,
      hasTradeType: completion.hasTradeType,
      hasHours: completion.hasHours,
      hasAccreditations: completion.hasAccreditations,
    }
  }

  return (
    <SettingsTabs
      activeTab={activeTab}
      tabs={tabs}
      tradeOptions={tradeOptions}
      days={days}
      profile={{
        business_name: profile?.business_name ?? null,
        trade_type: profile?.trade_type ?? null,
        business_hours: isRecord(profile?.business_hours) ? profile?.business_hours : {},
        accreditations: Array.isArray(profile?.accreditations) ? profile?.accreditations : [],
      }}
      portfolioImages={portfolioImages ?? []}
      liveSiteUrl={liveSiteUrl}
      onBusinessSave={handleBusinessSave}
      onHoursSave={handleHoursSave}
      onAccreditationsSave={handleAccreditationsSave}
      onPortfolioUpload={handlePortfolioUpload}
    />
  )
}
