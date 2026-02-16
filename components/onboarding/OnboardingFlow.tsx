'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { normalizeBusinessProfile, type BusinessProfile, getMissingRequiredFields } from '@/lib/businessProfile'
import { assignDefaultTemplate, normalizeTradeCategory } from '@/lib/templates/contract'
import { templates } from '@/lib/templates/registry'
import { industryPresets, applyPresetToProfile } from '@/lib/presets/industryPresets'

const steps = [
  'Template',
  'Basics',
  'Contact',
  'Services',
  'Trust',
  'Brand & Media',
  'Review',
] as const

type Step = (typeof steps)[number]

export default function OnboardingFlow() {
  const searchParams = useSearchParams()
  const templateFromUrl = searchParams.get('template') ?? 'template-1'

  const initialProfile = useMemo(
    () =>
      normalizeBusinessProfile({
        site: {
          templateId: templateFromUrl,
          published: false,
          sections: {
            hero: true,
            services: true,
            testimonials: true,
            gallery: true,
            pricing: true,
            faq: true,
            contact: true,
            footer: true,
          },
        },
      }),
    [templateFromUrl]
  )

  const [profile, setProfile] = useState<BusinessProfile>(initialProfile)
  const [stepIndex, setStepIndex] = useState(0)
  const [presetId, setPresetId] = useState(industryPresets[0]?.id ?? 'electrician')

  const step: Step = steps[stepIndex]

  const updateIdentity = (patch: Partial<BusinessProfile['identity']>) =>
    setProfile((prev) => {
      const nextIdentity = { ...prev.identity, ...patch }
      const nextSite = patch.tradeType
        ? {
            ...prev.site,
            templateId: assignDefaultTemplate(normalizeTradeCategory(patch.tradeType)),
          }
        : prev.site

      return {
        ...prev,
        identity: nextIdentity,
        site: nextSite,
      }
    })

  const updateContact = (patch: Partial<BusinessProfile['contact']>) =>
    setProfile((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }))

  const updateBrand = (patch: Partial<BusinessProfile['brand']>) =>
    setProfile((prev) => ({ ...prev, brand: { ...prev.brand, ...patch } }))

  const updateTrust = (patch: Partial<BusinessProfile['trust']>) =>
    setProfile((prev) => ({ ...prev, trust: { ...prev.trust, ...patch } }))

  const updateMedia = (patch: Partial<BusinessProfile['media']>) =>
    setProfile((prev) => ({ ...prev, media: { ...prev.media, ...patch } }))

  const setTemplateId = (id: string) =>
    setProfile((prev) => ({
      ...prev,
      site: { ...prev.site, templateId: id },
    }))

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

  const missingRequired = getMissingRequiredFields(profile)

  const togglePublished = () =>
    setProfile((prev) => ({
      ...prev,
      site: { ...prev.site, published: !prev.site.published },
    }))

  const toggleSection = (key: keyof BusinessProfile['site']['sections']) =>
    setProfile((prev) => ({
      ...prev,
      site: {
        ...prev.site,
        sections: {
          ...prev.site.sections,
          [key]: !prev.site.sections[key],
        },
      },
    }))

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Website setup</h1>
      <p className="mt-2 text-gray-600">Complete the steps to create your site.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1 text-xs ${
              i === stepIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {step === 'Template' && (
          <div>
            <h2 className="text-xl font-semibold">Choose a template</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`rounded-xl border p-4 text-left ${
                    profile.site.templateId === t.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="mt-1 text-xs text-gray-600">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'Basics' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Business basics</h2>

            <div className="grid gap-2 rounded-lg border border-gray-100 p-4">
              <label className="text-sm font-medium text-gray-700">
                Industry preset
              </label>
              <div className="flex flex-wrap gap-2">
                <select
                  className="rounded-lg border px-3 py-2 text-sm"
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                >
                  {industryPresets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                  onClick={() =>
                    setProfile((prev) => applyPresetToProfile(prev, presetId) as BusinessProfile)
                  }
                >
                  Apply preset
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Prefills services and copy without overwriting existing entries.
              </p>
            </div>

            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Business name"
              value={profile.identity.businessName}
              onChange={(e) => updateIdentity({ businessName: e.target.value })}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Trade type (e.g., electrician)"
              value={profile.identity.tradeType}
              onChange={(e) => updateIdentity({ tradeType: e.target.value })}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Tagline"
              value={profile.identity.tagline}
              onChange={(e) => updateIdentity({ tagline: e.target.value })}
            />
            <textarea
              className="rounded-lg border px-3 py-2"
              placeholder="Short description"
              value={profile.identity.shortDescription}
              onChange={(e) => updateIdentity({ shortDescription: e.target.value })}
            />
            <textarea
              className="rounded-lg border px-3 py-2"
              placeholder="Long description"
              value={profile.identity.longDescription}
              onChange={(e) => updateIdentity({ longDescription: e.target.value })}
            />
          </div>
        )}

        {step === 'Contact' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Phone"
              value={profile.contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Email"
              value={profile.contact.email ?? ''}
              onChange={(e) => updateContact({ email: e.target.value })}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Street"
              value={profile.contact.address?.street ?? ''}
              onChange={(e) =>
                updateContact({
                  address: { ...profile.contact.address, street: e.target.value },
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="City"
              value={profile.contact.address?.city ?? ''}
              onChange={(e) =>
                updateContact({
                  address: { ...profile.contact.address, city: e.target.value },
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Postcode"
              value={profile.contact.address?.postcode ?? ''}
              onChange={(e) =>
                updateContact({
                  address: { ...profile.contact.address, postcode: e.target.value },
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Service areas (comma separated)"
              value={profile.contact.serviceAreas.join(', ')}
              onChange={(e) =>
                updateContact({
                  serviceAreas: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        )}

        {step === 'Services' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Services</h2>
            <textarea
              className="rounded-lg border px-3 py-2"
              placeholder="One service per line: Name - Short description"
              value={profile.services
                .map((s) => `${s.name} - ${s.shortDescription}`)
                .join('\n')}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  services: e.target.value
                    .split('\n')
                    .map((line) => {
                      const [name, ...rest] = line.split('-')
                      return {
                        name: (name ?? '').trim(),
                        shortDescription: rest.join('-').trim(),
                      }
                    })
                    .filter((s) => s.name),
                }))
              }
            />
          </div>
        )}

        {step === 'Trust' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Trust signals</h2>
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Years in business"
              value={profile.trust.yearsInBusiness ?? ''}
              onChange={(e) =>
                updateTrust({
                  yearsInBusiness: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Licenses (comma separated)"
              value={profile.trust.licenses?.join(', ') ?? ''}
              onChange={(e) =>
                updateTrust({
                  licenses: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Insurance"
              value={profile.trust.insurance ?? ''}
              onChange={(e) => updateTrust({ insurance: e.target.value })}
            />
            <textarea
              className="rounded-lg border px-3 py-2"
              placeholder="Testimonials (one per line: Name - Quote)"
              value={profile.trust.testimonials
                .map((t) => `${t.name} - ${t.quote}`)
                .join('\n')}
              onChange={(e) =>
                updateTrust({
                  testimonials: e.target.value
                    .split('\n')
                    .map((line) => {
                      const [name, ...rest] = line.split('-')
                      return {
                        name: (name ?? '').trim(),
                        quote: rest.join('-').trim(),
                      }
                    })
                    .filter((t) => t.name && t.quote),
                })
              }
            />
          </div>
        )}

        {step === 'Brand & Media' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Brand & media</h2>

            <div className="grid gap-3 rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-700">Logo</p>
              {profile.brand.logoUrl && (
                <Image
                  src={profile.brand.logoUrl}
                  alt="Logo preview"
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const dataUrl = await readFileAsDataUrl(file)
                  updateBrand({ logoUrl: dataUrl })
                }}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Logo URL"
                value={profile.brand.logoUrl ?? ''}
                onChange={(e) => updateBrand({ logoUrl: e.target.value })}
              />
            </div>

            <div className="grid gap-3 rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-700">Hero image</p>
              {profile.media.heroImageUrl && (
                <Image
                  src={profile.media.heroImageUrl}
                  alt="Hero preview"
                  width={800}
                  height={112}
                  className="rounded-md object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const dataUrl = await readFileAsDataUrl(file)
                  updateMedia({ heroImageUrl: dataUrl })
                }}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Hero image URL"
                value={profile.media.heroImageUrl ?? ''}
                onChange={(e) => updateMedia({ heroImageUrl: e.target.value })}
              />
            </div>

            <div className="grid gap-3 rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-700">Gallery</p>
              {profile.media.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {profile.media.gallery.map((img, idx) => (
                    <Image
                      key={`${img}-${idx}`}
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      width={200}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? [])
                  if (files.length === 0) return
                  const dataUrls = await Promise.all(files.map(readFileAsDataUrl))
                  updateMedia({ gallery: [...profile.media.gallery, ...dataUrls] })
                }}
              />
              <textarea
                className="rounded-lg border px-3 py-2"
                placeholder="Gallery image URLs (one per line)"
                value={profile.media.gallery.join('\n')}
                onChange={(e) =>
                  updateMedia({
                    gallery: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>

            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Primary color (hex)"
              value={profile.brand.brandColors.primary}
              onChange={(e) =>
                updateBrand({
                  brandColors: {
                    ...profile.brand.brandColors,
                    primary: e.target.value,
                  },
                })
              }
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Secondary color (hex)"
              value={profile.brand.brandColors.secondary}
              onChange={(e) =>
                updateBrand({
                  brandColors: {
                    ...profile.brand.brandColors,
                    secondary: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        {step === 'Review' && (
          <div>
            <h2 className="text-xl font-semibold">Review</h2>

            <div className="mt-4 rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-700">Section toggles</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {Object.entries(profile.site.sections).map(([key, enabled]) => (
                  <button
                    key={key}
                    onClick={() => toggleSection(key as keyof BusinessProfile['site']['sections'])}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      enabled ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {key} — {enabled ? 'On' : 'Off'}
                  </button>
                ))}
              </div>
            </div>

            {missingRequired.length > 0 && (
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                <p className="font-medium">Missing required fields:</p>
                <ul className="mt-2 list-disc pl-5">
                  {missingRequired.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={togglePublished}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  profile.site.published ? 'bg-gray-700' : 'bg-[#2F6BFF]'
                }`}
              >
                {profile.site.published ? 'Unpublish' : 'Publish'}
              </button>
              <span className="text-sm text-gray-600">
                Status: {profile.site.published ? 'Published' : 'Draft'}
              </span>
            </div>

            <pre className="mt-4 overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={back}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            disabled={stepIndex === 0}
          >
            Back
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
          >
            {stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })