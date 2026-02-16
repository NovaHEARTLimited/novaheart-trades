import { notFound } from 'next/navigation'
import { getPublicSiteBySlug } from '@/lib/website/public'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { normalizeBusinessProfile } from '@/lib/businessProfile'

interface PageProps {
  params: Promise<{ slug: string; page: string }>
}

export default async function PublicSitePage({ params }: PageProps) {
  const { slug } = await params
  
  const site = await getPublicSiteBySlug(slug)
  if (!site) notFound()

  const businessProfile = normalizeBusinessProfile(site.business_profile || {})

  return <TemplateRenderer profile={businessProfile} siteSlug={slug} />
}
