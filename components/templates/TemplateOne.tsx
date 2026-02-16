import React from 'react';
import Image from 'next/image';
import { Calendar, CheckCircle2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import type { BusinessProfile } from '@/lib/businessProfile';
import { ContactForm } from '../website/ContactForm';

type Props = {
  profile: BusinessProfile
  siteSlug: string
};

function getTradeColor(tradeType: string) {
  const value = tradeType.toLowerCase()
  if (value.includes('plumb')) return '#2563EB'
  if (value.includes('electric')) return '#F59E0B'
  if (value.includes('hvac') || value.includes('heating') || value.includes('cool'))
    return '#0EA5E9'
  if (value.includes('roof')) return '#DC2626'
  if (value.includes('landscape') || value.includes('garden')) return '#16A34A'
  if (value.includes('paint')) return '#7C3AED'
  if (value.includes('carpenter') || value.includes('joiner')) return '#B45309'
  return '#2563EB'
}

function isEmergencyTrade(tradeType: string) {
  const value = tradeType.toLowerCase()
  return value.includes('plumb') || value.includes('electric') || value.includes('lock')
}

const HeroSection = ({ profile }: { profile: BusinessProfile }) => {
  const { identity, contact, brand, media } = profile
  const tradeType = identity.tradeType?.trim() || 'Local Contractor'
  const businessName = identity.businessName?.trim() || 'Trusted Local Pro'
  const primaryColor = brand.brandColors?.primary?.trim() || getTradeColor(tradeType)
  const heroTagline = identity.tagline?.trim() || `Reliable ${tradeType} you can count on`
  const heroDescription =
    identity.shortDescription?.trim() ||
    `Fast, professional ${tradeType.toLowerCase()} service across ${
      contact.serviceAreas?.[0] ?? 'your local area'
    }.`
  const serviceAreaLabel = contact.serviceAreas?.[0] ?? 'Your Local Area'
  const phoneLabel = contact.phone?.trim() || 'Call for availability'
  const emergencyPulse = isEmergencyTrade(tradeType) ? 'animate-pulse' : ''

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700">
            <ShieldCheck size={16} style={{ color: primaryColor }} />
            Verified {tradeType}
          </div>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {heroTagline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {heroDescription}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={`tel:${contact.phone}`}
              className={`flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 ${emergencyPulse}`}
              style={{ backgroundColor: primaryColor }}
            >
              <Phone size={20} /> Call Now
            </a>
            <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:border-gray-900">
              <Calendar size={20} style={{ color: primaryColor }} /> Book a Quote
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"
                />
              ))}
            </div>
            <p>Joined by 200+ local homeowners</p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
            {media.heroImageUrl ? (
              <Image
                src={media.heroImageUrl}
                alt={`${businessName} hero project spotlight`}
                className="h-full w-full object-cover"
                width={800}
                height={800}
                priority
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-gray-100 to-gray-300" />
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-6 shadow-xl md:block">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Service Area</p>
            <p className="text-xl font-bold text-gray-900">
              {serviceAreaLabel} &amp; Surrounding
            </p>
            <p className="mt-2 text-sm text-gray-500">{phoneLabel}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const ServicesSection = ({ profile }: { profile: BusinessProfile }) => {
  const { services } = profile
  const primaryColor = profile.brand.brandColors?.primary?.trim() || getTradeColor(profile.identity.tradeType)

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Expert Services
          </h2>
          <p className="mt-4 text-gray-600">Professional craftsmanship for every project.</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={`${service.name}-${index}`}
              className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className="mb-4 inline-flex rounded-lg p-3"
                style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {service.name || 'Quality Service'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {service.shortDescription ||
                  `Fully insured and guaranteed workmanship for all our ${
                    service.name?.toLowerCase() || 'trade'
                  } tasks.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = ({ profile }: { profile: BusinessProfile }) => {
  const { trust } = profile
  const businessName = profile.identity.businessName?.trim() || 'trusted local team'

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Wall of Love</h2>
          <p className="mt-4 text-gray-600">Real stories from homeowners who trust us.</p>
        </div>
        <div className="mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
          {trust.testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              className="min-w-[80%] snap-start rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm lg:min-w-0"
            >
              <p className="text-gray-700">
                {testimonial.quote || `Great work and friendly service from ${businessName}.`}
              </p>
              <p className="mt-4 text-sm font-semibold text-gray-500">
                {testimonial.name || 'Verified Homeowner'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const GallerySection = ({ profile }: { profile: BusinessProfile }) => {
  const { media } = profile
  const businessName = profile.identity.businessName?.trim() || 'Local Contractor'

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Recent Projects</h2>
        <div className="columns-1 space-y-4 sm:columns-2 lg:columns-3">
          {(media.gallery ?? []).map((url, index) => (
            <div key={`${url}-${index}`} className="break-inside-avoid overflow-hidden rounded-2xl">
              <Image
                src={url}
                alt={`${businessName} project gallery ${index + 1}`}
                width={600}
                height={800}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ContactSection = ({ profile, siteSlug }: { profile: BusinessProfile; siteSlug: string }) => {
  const { contact } = profile
  const businessName = profile.identity.businessName?.trim() || 'Local Contractor'
  const primaryColor = profile.brand.brandColors?.primary?.trim() || getTradeColor(profile.identity.tradeType)
  const locationLabel = contact.address?.city || contact.address?.postcode
    ? `${contact.address?.city || 'Your City'}, ${contact.address?.postcode || ''}`.trim()
    : 'Serving your local area'
  const phoneLabel = contact.phone?.trim() || 'Call for availability'

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white md:p-16">
        <div className="relative z-10 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Ready to start your project?</h2>
            <p className="mt-4 text-gray-400">
              Contact {businessName} today for a free, no-obligation estimate.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/10 p-3">
                  <Phone size={24} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-lg font-semibold">{phoneLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/10 p-3">
                  <MapPin size={24} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-lg font-semibold">{locationLabel}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ContactForm 
              siteSlug={siteSlug}
              businessName={businessName}
              services={profile.services.map(s => s.name)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TemplateOne({ profile, siteSlug }: Props) {
  const hasServices = profile.services.length > 0 && profile.site.sections.services
  const hasTestimonials =
    profile.trust.testimonials.length > 0 && profile.site.sections.testimonials
  const hasGallery = profile.media.gallery.length > 0 && profile.site.sections.gallery

  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      <HeroSection profile={profile} />
      {hasServices && <ServicesSection profile={profile} />}
      {hasTestimonials && <TestimonialsSection profile={profile} />}
      {hasGallery && <GallerySection profile={profile} />}
      <ContactSection profile={profile} siteSlug={siteSlug} />
    </main>
  )
}
