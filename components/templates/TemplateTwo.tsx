import React from 'react';
import Image from 'next/image';
import { Building2, Hammer, ShieldCheck, Star } from 'lucide-react';
import type { BusinessProfile, Service, Testimonial } from '@/lib/businessProfile';
import { normalizeBusinessProfile } from '@/lib/businessProfile';
import { ContactForm } from '../website/ContactForm';

type Props = {
  profile?: Partial<BusinessProfile> | BusinessProfile;
  siteSlug: string;
};

function getTradeColor(tradeType: string) {
  const value = (tradeType || '').toLowerCase();
  if (value.includes('plumb')) return '#2563EB';
  if (value.includes('electric')) return '#F59E0B';
  if (value.includes('hvac') || value.includes('heating') || value.includes('cool'))
    return '#0EA5E9';
  if (value.includes('roof')) return '#DC2626';
  if (value.includes('landscape') || value.includes('garden')) return '#16A34A';
  if (value.includes('paint')) return '#7C3AED';
  if (value.includes('carpenter') || value.includes('joiner')) return '#B45309';
  return '#2563EB';
}

export default function TemplateTwo({ profile, siteSlug }: Props) {
  // Use your normalize function so we never replace your schema
  const normalized = normalizeBusinessProfile(profile as Partial<BusinessProfile> | undefined);

  const {
    identity,
    brand,
    services,
    trust,
    site,
    media,
  } = normalized;

  const sections = site?.sections ?? {};
  const tradeType = (identity.tradeType || 'Construction') as string;
  const businessName = (identity.businessName || 'The Craftsman') as string;
  const tagline = (identity.tagline || `Crafted ${tradeType} spaces built to last`) as string;
  const shortDescription =
    (identity.shortDescription ||
      `High-end ${tradeType.toLowerCase()} projects delivered with meticulous detail.`) as string;
  const primaryColor = (brand?.brandColors?.primary || getTradeColor(tradeType)) as string;
  const heroImageUrl = (media?.heroImageUrl || '').trim();
  const gallery = Array.isArray(media?.gallery) ? media.gallery : [];
  const galleryItems = gallery.length > 0 ? gallery : Array.from({ length: 6 }, () => '');
  const serviceCards: Service[] = services && services.length > 0 ? services : [
    { name: 'Custom Builds', shortDescription: 'Tailored spaces with premium finishes.' },
    { name: 'Renovations', shortDescription: 'Seamless upgrades that elevate daily living.' },
    { name: 'Detail Work', shortDescription: 'Precision craftsmanship from start to finish.' },
  ];
  const partnerBrands: string[] = Array.isArray(trust?.licenses) && trust.licenses.length > 0 ? trust.licenses : ['Atlas', 'Bosch', 'DeWalt', 'Hilti', 'Makita'];

  const hasServices = serviceCards.length > 0 && Boolean(sections.services);
  const hasTestimonials = Array.isArray(trust?.testimonials) && trust.testimonials.length > 0 && Boolean(sections.testimonials);
  const hasHero = Boolean(sections.hero);
  const hasContact = Boolean(sections.contact);
  const hasGallery = gallery.length > 0 && Boolean(sections.gallery);

  return (
    <main className="bg-white text-gray-900">
      {hasHero && (
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={`${businessName} signature project hero`}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-gray-100 via-gray-200 to-gray-300" />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white"
                aria-hidden
              >
                <ShieldCheck size={14} style={{ color: primaryColor }} />
                {tradeType}
              </div>

              <h1 id="hero-heading" className="mt-6 font-serif text-5xl font-semibold tracking-tight text-white md:text-6xl">
                {tagline}
              </h1>

              <p className="mt-6 text-lg text-white/80">{shortDescription}</p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  aria-label="Request a consultation"
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: primaryColor }}
                  tabIndex={0}
                >
                  Request a Consultation
                </button>

                <button
                  aria-label="View portfolio"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  tabIndex={0}
                >
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {hasServices && (
        <section className="bg-white py-20" aria-labelledby="services-heading">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Signature Services</p>
              <h2 id="services-heading" className="font-serif text-4xl font-semibold tracking-tight text-gray-900">
                Crafted with intention
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serviceCards.map((service: Service, index: number) => (
                <div key={`${service.name ?? 'service'}-${index}`} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 shadow-sm" aria-hidden>
                      <Hammer size={18} style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.name ?? 'Premium Service'}</h3>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    {service.shortDescription ?? 'Thoughtful planning, premium materials, and a refined finish.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasGallery && (
        <section className="bg-gray-50 py-20" aria-labelledby="gallery-heading">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Portfolio</p>
              <h2 id="gallery-heading" className="font-serif text-4xl font-semibold tracking-tight text-gray-900">
                Visual craftsmanship
              </h2>
            </div>

            <div className="mt-12 columns-1 space-y-4 sm:columns-2 lg:columns-3">
              {galleryItems.map((url: string, index: number) => (
                <div key={`${url ?? 'empty'}-${index}`} className="break-inside-avoid" role="group" aria-label={`Portfolio image ${index + 1}`}>
                  {url ? (
                    <Image
                      src={url}
                      alt={`${businessName} portfolio image ${index + 1}`}
                      width={640}
                      height={800}
                      className="w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="h-72 rounded-2xl bg-linear-to-br from-gray-200 via-gray-100 to-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasTestimonials && (
        <section className="bg-white py-20" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Client Notes</p>
                <h2 id="testimonials-heading" className="mt-3 font-serif text-3xl font-semibold text-gray-900">
                  Trusted by homeowners
                </h2>
              </div>

              <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex" aria-hidden>
                <Star size={16} style={{ color: primaryColor }} /> Rated 5.0
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {(trust.testimonials ?? []).map((testimonial: Testimonial, index: number) => (
                <div key={`${testimonial.name ?? 'client'}-${index}`} className="rounded-2xl border border-gray-100 p-6">
                  <p className="text-gray-700">{testimonial.quote ?? `Beautiful craftsmanship from ${businessName}.`}</p>
                  <p className="mt-4 text-sm font-semibold text-gray-900">{testimonial.name ?? 'Verified Client'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-gray-100 bg-white py-12" aria-labelledby="materials-heading">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Materials We Use</p>
            <h3 id="materials-heading" className="mt-3 font-serif text-2xl font-semibold text-gray-900">
              Premium partners for lasting quality
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {partnerBrands.map((brandName: string, index: number) => (
              <div
                key={`${brandName ?? 'partner'}-${index}`}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600"
              >
                <Building2 size={16} style={{ color: primaryColor }} />
                {brandName ?? 'Partner Brand'}
              </div>
            ))}
          </div>
        </div>
      </section>

      {hasContact && (
        <section className="bg-gray-50 py-16" aria-labelledby="contact-heading">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="contact-heading" className="sr-only">Contact</h2>
            <ContactForm
              siteSlug={siteSlug}
              businessName={businessName}
              services={(services ?? []).map((s: Service) => s.name ?? '')}
            />
          </div>
        </section>
      )}
    </main>
  );
}
