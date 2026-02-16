import React from 'react';
import Image from 'next/image';
import { Briefcase, FileText, ShieldCheck, ShieldPlus, Star } from 'lucide-react';
import type { BusinessProfile } from '@/lib/businessProfile';
import ProfileCompletionWidget from '@/components/dashboard/ProfileCompletionWidget';

type Props = {
  profile: BusinessProfile;
};

const defaultCompliance = [
  { label: 'ISO 9001', icon: ShieldCheck },
  { label: 'ISO 45001', icon: ShieldPlus },
  { label: 'Fully Insured', icon: Star },
]

export default function TemplateThree({ profile }: Props) {
  const { identity, contact, brand, services, trust, media, site } = profile
  const brandColor = brand.brandColors?.primary?.trim() || '#1F2937'
  const businessName = identity.businessName?.trim() || 'Commercial Pro Contractors'
  const tradeType = identity.tradeType?.trim() || 'Commercial Construction'
  const tagline = identity.tagline?.trim() || `Delivering ${tradeType} projects at scale`
  const shortDescription =
    identity.shortDescription?.trim() ||
    'Structured delivery, certified teams, and transparent reporting for complex programs.'
  const longDescription =
    identity.longDescription?.trim() ||
    'We partner with enterprise clients on high-complexity builds, major refurbishments, and nationwide maintenance frameworks.'
  const heroImageUrl = media.heroImageUrl?.trim()
  const galleryItems = media.gallery?.length
    ? media.gallery
    : ['Project Alpha', 'Project Bravo', 'Project Delta']
  const serviceItems = services.length
    ? services
    : [
        {
          name: 'Design & Build',
          shortDescription: 'Full lifecycle delivery with cross-functional teams.',
        },
        {
          name: 'Facilities Management',
          shortDescription: 'Planned maintenance and responsive support programs.',
        },
        {
          name: 'Framework Delivery',
          shortDescription: 'Multi-site rollout with standardized reporting.',
        },
      ]
  const complianceItems = trust.licenses?.length
    ? trust.licenses.map((label) => ({ label, icon: ShieldCheck }))
    : defaultCompliance
  const contactAddress = contact.address
  const headOffice =
    [contactAddress?.street, contactAddress?.city, contactAddress?.postcode]
      .filter(Boolean)
      .join(', ') || 'Head Office address available on request.'

  const profileBusinessHours = {
    monday: '08:00–18:00',
    tuesday: '08:00–18:00',
    wednesday: '08:00–18:00',
    thursday: '08:00–18:00',
    friday: '08:00–18:00',
    saturday: '08:00–18:00',
    sunday: '08:00–18:00',
  }

  return (
    <main className="bg-gray-50 text-gray-900">
      {site.sections.hero && (
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                <Briefcase size={14} style={{ color: brandColor }} /> Commercial Pro
              </div>
              <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
                {tagline}
              </h1>
              <p className="text-lg text-gray-600">{shortDescription}</p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  <FileText size={16} style={{ color: 'currentColor' }} /> Request a Tender
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900">
                  Download Capability Statement
                </button>
              </div>
              <p className="text-sm text-gray-500">{businessName}</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={`${businessName} commercial project overview`}
                  width={720}
                  height={560}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-12 text-sm text-gray-500">
                  Signature project showcase
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Corporate Delivery</h2>
              <p className="mt-4 text-gray-600">{longDescription}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Compliance &amp; Safety
              </p>
              <div className="mt-6 grid gap-4">
                {complianceItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3"
                    >
                      <Icon size={18} style={{ color: brandColor }} />
                      <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {site.sections.services && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Capabilities</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                {tradeType}
              </span>
            </div>
            <div className="mt-8 grid gap-6">
              {serviceItems.map((service, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="grid gap-3 border-b border-gray-100 pb-6 md:grid-cols-[220px_1fr]"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {service.name || 'Capability'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {service.shortDescription ||
                      'Structured delivery with clear governance and reporting.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.sections.gallery && (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Projects</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((entry, index) => (
                <div key={`${entry}-${index}`} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-sm font-semibold text-gray-900">
                    {typeof entry === 'string' && entry ? entry : `Project ${index + 1}`}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                    {contactAddress?.city || 'United Kingdom'}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Scope of Work: Lifecycle maintenance, compliance upgrades, and phased delivery.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.sections.testimonials && trust.testimonials.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Client References</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Verified outcomes
              </span>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {trust.testimonials.map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className="rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-600">
                    {testimonial.quote ||
                      `${businessName} delivered against our compliance requirements.`}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    {testimonial.name || 'Commercial Client'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.sections.contact && (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Head Office</h2>
                <p className="mt-4 text-gray-600">{headOffice}</p>
                <div className="mt-6 grid gap-2 text-sm text-gray-600">
                  <p>Business Hours: Mon–Fri, 8:00–18:00</p>
                  <p>Phone: {contact.phone?.trim() || 'Available on request'}</p>
                  <p>Email: {contact.email?.trim() || 'tenders@company.com'}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Tender Desk
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Share your scope, timelines, and compliance needs. Our commercial team responds within 24 hours.
                </p>
                <button
                  className="mt-6 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  <FileText size={16} style={{ color: 'currentColor' }} /> Request a Tender
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <ProfileCompletionWidget
        profile={profile}
        businessHours={profileBusinessHours}
        actionLinks={{
          trade_type: '/dashboard/profile?tab=basics',
          business_hours: '/dashboard/profile?tab=hours',
          accreditations: '/dashboard/profile?tab=accreditations',
          gallery: '/dashboard/profile?tab=media',
        }}
      />
    </main>
  )
}