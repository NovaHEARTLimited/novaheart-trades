import type { Metadata } from 'next'
import type { BusinessProfile } from './businessProfile'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildBusinessMetadata(
  profile: BusinessProfile,
  overrides?: { title?: string; description?: string }
): Metadata {
  const title =
    overrides?.title ?? `${profile.identity.businessName} | ${profile.identity.tradeType}`

  const description =
    overrides?.description ?? profile.identity.shortDescription

  const keywords = Array.from(
    new Set([
      profile.identity.businessName,
      profile.identity.tradeType,
      ...profile.contact.serviceAreas,
      ...profile.services.map((s) => s.name),
    ])
  ).filter(Boolean)

  const ogImage = profile.media.heroImageUrl || profile.brand.logoUrl || undefined

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}