'use server'

import { createClient } from '@/lib/supabase/server'
import { getOrCreateSite } from '@/lib/website/site'
import { generateSiteContent } from './generate-site-content'
import type { BusinessProfile } from '@/lib/businessProfile'

interface OnboardingData {
  businessName: string
  tradeType: string
  services: string[]
  location: string
  phone: string
  email: string
}

export async function applyTemplateWithAI(
  templateId: string,
  onboardingData: OnboardingData
): Promise<string> {
  console.log('=== APPLY TEMPLATE STARTED ===')
  console.log('Template ID:', templateId)
  console.log('Business Name:', onboardingData.businessName)

  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log('User check:', user ? `Authenticated as ${user.id}` : 'NOT AUTHENTICATED')
  console.log('Auth error:', authError)
  
  const site = await getOrCreateSite()
  console.log('Site result:', site)
  
  if (!site) {
    console.error('ERROR: getOrCreateSite returned null')
    throw new Error('Could not create site - please refresh the page and try again')
  }

  // Generate slug from business name
  const slug = onboardingData.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'my-site'

  console.log('Generated slug:', slug)

  // Generate AI content
  console.log('Generating AI content...')
  const aiContent = await generateSiteContent(onboardingData)

  // Map template IDs: classic -> template-1, modern -> template-2
  const mappedTemplateId = templateId === 'classic' ? 'template-1' : 
                           templateId === 'modern' ? 'template-2' : 
                           'template-1'

  console.log('Mapped template ID:', mappedTemplateId)

  // Create BusinessProfile object
  const businessProfile: BusinessProfile = {
    identity: {
      businessName: onboardingData.businessName,
      tradeType: onboardingData.tradeType,
      tagline: aiContent.hero.title,
      shortDescription: aiContent.hero.subtitle,
      longDescription: aiContent.about.content,
    },
    contact: {
      phone: onboardingData.phone,
      email: onboardingData.email,
      address: {
        street: '',
        city: onboardingData.location,
        postcode: '',
      },
      serviceAreas: [onboardingData.location],
    },
    brand: {
      logoUrl: '',
      brandColors: {
        primary: '#2F6BFF',
        secondary: '#111827',
      },
    },
    services: aiContent.services.map((s: { title: string; description: string }) => ({
      name: s.title,
      shortDescription: s.description,
    })),
    trust: {
      testimonials: [],
      yearsInBusiness: undefined,
      licenses: [],
      insurance: '',
    },
    media: {
      heroImageUrl: '',
      gallery: [],
    },
    site: {
      templateId: mappedTemplateId,
      published: true,
      sections: {
        hero: true,
        services: true,
        testimonials: false,
        gallery: false,
        pricing: false,
        faq: false,
        contact: true,
        footer: true,
      },
    },
  }

  console.log('Updating site in database...')

  // Update site with slug, template, and business profile
  const { error: updateError } = await supabase
    .from('sites')
    .update({ 
      slug: slug,
      template_id: mappedTemplateId,
      setup_status: 'published',
      business_profile: businessProfile
    })
    .eq('id', site.id)

  if (updateError) {
    console.error('Database update error:', updateError)
    throw new Error(`Failed to update site: ${updateError.message}`)
  }

  console.log('=== APPLY TEMPLATE COMPLETED ===')
  console.log('Final slug:', slug)

  return slug
}

