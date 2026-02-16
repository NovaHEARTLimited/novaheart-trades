import React from 'react';
import Image from 'next/image';
import type { BusinessProfile } from '@/lib/businessProfile';

type Props = {
  profile: BusinessProfile;
};

const HeroSection = ({ profile }: Props) => {
  const { identity, contact, brand, media } = profile

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{identity.tradeType}</p>
          <h1 className="mt-2 text-4xl font-bold">{identity.tagline}</h1>
          <p className="mt-3 text-gray-600">{identity.shortDescription}</p>
          <div className="mt-5 flex gap-3">
            <button
              className="rounded-lg px-5 py-3 text-sm font-medium text-white"
              style={{ backgroundColor: brand.brandColors.primary }}
            >
              Call {contact.phone}
            </button>
            <button className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-800">
              Get a quote
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          {media.heroImageUrl ? (
            <Image
              src={media.heroImageUrl}
              alt={identity.businessName}
              className="h-64 w-full rounded-xl object-cover"
              width={500}
              height={256}
            />
          ) : (
            <div className="h-64 rounded-xl bg-linear-to-br from-gray-100 to-gray-200" />
          )}
        </div>
      </div>
    </section>
  )
}

const ServicesSection = ({ profile }: Props) => {
  const { services } = profile

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">Services</h2>
        <ul className="mt-2 text-gray-600">
          {services.map((service, index) => (
            <li key={`${service.name}-${index}`}>{service.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const TestimonialsSection = ({ profile }: Props) => {
  const { trust } = profile

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">Testimonials</h2>
        {trust.testimonials.map((testimonial, index) => (
          <div key={`${testimonial.name}-${index}`} className="mt-2">
            <p>{testimonial.quote}</p>
            <p className="text-sm text-gray-500">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const GallerySection = ({ profile }: Props) => {
  const { identity, media } = profile

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {media.gallery.map((url, index) => (
            <Image
              key={`${url}-${index}`}
              src={url}
              alt={`${identity.businessName} gallery ${index + 1}`}
              width={500}
              height={300}
              className="h-40 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const ContactSection = ({ profile }: Props) => {
  const { contact } = profile

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-2 text-gray-600">{contact.phone}</p>
        {contact.email && <p className="text-gray-600">{contact.email}</p>}
        <p className="mt-2 text-gray-600">
          {contact.address?.street} {contact.address?.city}{' '}
          {contact.address?.postcode}
        </p>
        <p className="mt-2 text-gray-500">
          Serving: {contact.serviceAreas.join(', ')}
        </p>
      </div>
    </section>
  )
}

export default function TemplateFive({ profile }: Props) {
  const hasServices = profile.services.length > 0 && profile.site.sections.services
  const hasTestimonials =
    profile.trust.testimonials.length > 0 && profile.site.sections.testimonials
  const hasGallery = profile.media.gallery.length > 0 && profile.site.sections.gallery

  return (
    <div>
      <HeroSection profile={profile} />
      {hasServices && <ServicesSection profile={profile} />}
      {hasTestimonials && <TestimonialsSection profile={profile} />}
      {hasGallery && <GallerySection profile={profile} />}
      <ContactSection profile={profile} />
    </div>
  )
}