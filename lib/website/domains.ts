import { randomBytes } from 'crypto'
import { resolveTxt } from 'dns/promises'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'

export interface SiteDomain {
  id: string
  domain: string
  status: 'pending' | 'verified'
  verification_token: string | null
}

export async function getDomains() {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return []

  const { data } = await supabase
    .from('site_domains')
    .select('id, domain, status, verification_token')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })

  return (data ?? []) as SiteDomain[]
}

export async function addDomain(domain: string) {
  const supabase = await createClient()
  const site = await getOrCreateSite()
  if (!site) return

  const token = randomBytes(12).toString('hex')

  await supabase
    .from('site_domains')
    .insert({ site_id: site.id, domain, status: 'pending', verification_token: token })
}

export async function verifyDomain(domainId: string) {
  const supabase = await createClient()

  const { data: row } = await supabase
    .from('site_domains')
    .select('id, domain, verification_token')
    .eq('id', domainId)
    .maybeSingle()

  if (!row?.domain || !row?.verification_token) return false

  const records = await resolveTxt(row.domain).catch(() => [])
  const flat = records.flat().join(' ')

  const expected = `nova-verify=${row.verification_token}`
  if (!flat.includes(expected)) return false

  await supabase
    .from('site_domains')
    .update({ status: 'verified' })
    .eq('id', row.id)

  return true
}

export async function deleteDomain(id: string) {
  const supabase = await createClient()
  await supabase.from('site_domains').delete().eq('id', id)
}