import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import PublicSite from './_components/PublicSite'
import {
  getPublicPageBySlug,
  getPublicPages,
  getPublicSectionsByPageId,
  getPublicSettings,
  getPublicSiteByDomain,
  getPublicSiteBySlug,
  getPublicTheme,
} from '@/lib/website/public'
import { getSectionImages } from '@/lib/website/gallery'

interface PageProps {
  params: Promise<{ slug: string; page: string }>
}

export default async function PublicSitePage({ params }: PageProps) {
  const { slug, page: pageSlug } = await params
  
  const site = await getPublicSiteBySlug(slug)
  if (!site) notFound()

  const host = (await headers()).get('host') || ''
  const domain = host.replace(/:\d+$/, '').replace(/^www\./, '')
  const domainSite = await getPublicSiteByDomain(domain)

  const basePath =
    domainSite?.slug === site.slug ? '' : `/site/${site.slug}`

  const theme = await getPublicTheme(site.id)
  const settings = await getPublicSettings(site.id)
  const pages = await getPublicPages(site.id)

  const page = await getPublicPageBySlug(site.id, pageSlug)
  if (!page) notFound()

  const sectionsBase = await getPublicSectionsByPageId(page.id)

  const sections = await Promise.all(
    sectionsBase.map(async (s) => ({
      ...s,
      gallery: (await getSectionImages(s.id)).map((g) => ({
        id: g.id,
        image_url_published: g.image_url_published,
      })),
    }))
  )

  return (
    <PublicSite
      pages={pages}
      pageTitle={page.title}
      sections={sections}
      theme={theme ?? undefined}
      analyticsId={settings?.analytics_id ?? null}
      basePath={basePath}
    />
  )
}

