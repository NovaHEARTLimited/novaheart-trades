import React from "react";
import Image from "next/image";
import type { BusinessProfile } from "@/lib/businessProfile";

type Props = {
  profile: BusinessProfile;
};

const HeroSection = ({ profile }: Props) => {
  const { identity, media } = profile;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold">{identity.tagline}</h1>
          <p className="mt-3 text-gray-600">{identity.shortDescription}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          {media.heroImageUrl ? (
            <Image
              src={media.heroImageUrl}
              alt={identity.businessName}
              width={500}
              height={224}
              className="h-56 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="h-56 rounded-xl bg-linear-to-br from-gray-100 to-gray-200" />
          )}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = ({ profile }: Props) => {
  const { services, site } = profile;
  const hasServices = services.length > 0 && site.sections.services;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="mt-3 text-gray-600">What we do best.</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          {hasServices && (
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={`${service.name}-${index}`} className="text-sm text-gray-700">
                  {service.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

const GallerySection = ({ profile }: Props) => {
  const { identity, media, site } = profile;
  const hasGallery = media.gallery.length > 0 && site.sections.gallery;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Our Gallery</h2>
          <p className="mt-3 text-gray-600">Recent work highlights.</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          {hasGallery && (
            <div className="grid grid-cols-2 gap-3">
              {media.gallery.map((url, index) => (
                <Image
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${identity.businessName} gallery ${index + 1}`}
                  width={240}
                  height={160}
                  className="h-32 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContactSection = ({ profile }: Props) => {
  const { contact } = profile;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-2 text-gray-600">{contact.phone}</p>
        {contact.email && <p className="text-gray-600">{contact.email}</p>}
        <p className="mt-2 text-gray-600">
          {contact.address?.street} {contact.address?.city}{" "}
          {contact.address?.postcode}
        </p>
      </div>
    </section>
  );
};

export default function TemplateFour({ profile }: Props) {
  const { site } = profile;

  return (
    <div>
      {site.sections.hero && <HeroSection profile={profile} />}
      {site.sections.services && <ServicesSection profile={profile} />}
      {site.sections.gallery && <GallerySection profile={profile} />}
      {site.sections.contact && <ContactSection profile={profile} />}
    </div>
  );
}