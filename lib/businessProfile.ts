import { z } from 'zod'

const LenientString = z.string().trim().default('')
const LenientUrl = z.string().trim().default('')

const AddressSchema = z.object({
  street: LenientString,
  city: LenientString,
  postcode: LenientString,
})

const BrandColorsSchema = z
  .object({
    primary: LenientString,
    secondary: LenientString,
  })
  .default({
    primary: '#2F6BFF',
    secondary: '#111827',
  })

const ServiceSchema = z.object({
  name: LenientString,
  shortDescription: LenientString,
})

const TestimonialSchema = z.object({
  name: LenientString,
  quote: LenientString,
})

export const BusinessProfileSchema = z.object({
  identity: z.object({
    businessName: LenientString,
    tradeType: LenientString,
    tagline: LenientString,
    shortDescription: LenientString,
    longDescription: LenientString,
  }),
  contact: z.object({
    phone: LenientString,
    email: LenientString,
    address: AddressSchema.default({
      street: '',
      city: '',
      postcode: '',
    }),
    serviceAreas: z.array(LenientString).default([]),
  }),
  brand: z.object({
    logoUrl: LenientUrl,
    brandColors: BrandColorsSchema,
  }),
  services: z.array(ServiceSchema).default([]),
  trust: z.object({
    testimonials: z.array(TestimonialSchema).default([]),
    yearsInBusiness: z
      .preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z.coerce.number().int().nonnegative().optional()
      )
      .optional(),
    licenses: z.array(LenientString).default([]),
    insurance: LenientString,
  }),
  media: z.object({
    heroImageUrl: LenientUrl,
    gallery: z.array(LenientUrl).default([]),
  }),
  site: z.object({
    templateId: LenientString.default('template-1'),
    published: z.boolean().default(false),
    sections: z
      .object({
        hero: z.boolean().default(true),
        services: z.boolean().default(true),
        testimonials: z.boolean().default(true),
        gallery: z.boolean().default(true),
        pricing: z.boolean().default(false),
        faq: z.boolean().default(false),
        contact: z.boolean().default(true),
        footer: z.boolean().default(true),
      })
      .default({
        hero: true,
        services: true,
        testimonials: true,
        gallery: true,
        pricing: false,
        faq: false,
        contact: true,
        footer: true,
      }),
  }),
})

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>

export function normalizeBusinessProfile(
  input?: Partial<BusinessProfile>
): BusinessProfile {
  const base = BusinessProfileSchema.parse({
    identity: {},
    contact: {},
    brand: {},
    services: [],
    trust: {},
    media: {},
    site: {},
    ...input,
  })

  const tradeType = base.identity.tradeType || 'trade'
  const serviceAreaText =
    base.contact.serviceAreas.length > 0
      ? base.contact.serviceAreas.join(', ')
      : 'your area'

  const tagline =
    base.identity.tagline || `Reliable local ${tradeType}`

  const shortDescription =
    base.identity.shortDescription ||
    `Trusted ${tradeType} serving ${serviceAreaText}.`

  const longDescription =
    base.identity.longDescription || shortDescription

  return {
    ...base,
    identity: {
      ...base.identity,
      tagline,
      shortDescription,
      longDescription,
    },
    site: {
      ...base.site,
      templateId: base.site.templateId || 'template-1',
    },
  }
}

export function getMissingRequiredFields(profile: BusinessProfile): string[] {
  const missing: string[] = []

  if (!profile.identity.businessName) missing.push('identity.businessName')
  if (!profile.identity.tradeType) missing.push('identity.tradeType')
  if (!profile.identity.tagline) missing.push('identity.tagline')
  if (!profile.identity.shortDescription) missing.push('identity.shortDescription')
  if (!profile.contact.phone) missing.push('contact.phone')
  if (!profile.site.templateId) missing.push('site.templateId')

  return missing
}