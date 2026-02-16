'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, UploadCloud } from 'lucide-react'
import { useMemo, useActionState } from 'react'
import AccreditationsField from './AccreditationsField'

const EMPTY_HOURS = new Set(['', 'default', 'tbd', 'to be confirmed', 'n/a'])

type Tab = { id: string; label: string }

type TradeOption = { value: string; label: string }

type Day = { key: string; label: string }

type PortfolioImage = {
  id: string
  image_url_draft: string | null
  image_url_published: string | null
}

type ActionState = {
  ok: boolean
  message?: string
  hasTradeType?: boolean
  hasHours?: boolean
  hasAccreditations?: boolean
  galleryCount?: number
  uploaded?: Array<{ name: string; url: string }>
}

type Props = {
  activeTab: string
  tabs: Tab[]
  tradeOptions: TradeOption[]
  days: Day[]
  profile: {
    business_name?: string | null
    trade_type?: string | null
    business_hours?: unknown
    accreditations?: string[] | null
  }
  portfolioImages: PortfolioImage[]
  liveSiteUrl: string
  onBusinessSave: (formData: FormData) => Promise<ActionState>
  onHoursSave: (formData: FormData) => Promise<ActionState>
  onAccreditationsSave: (formData: FormData) => Promise<ActionState>
  onPortfolioUpload: (formData: FormData) => Promise<ActionState>
}

function hasMeaningfulHours(hours?: unknown) {
  if (!hours) return false
  if (typeof hours !== 'object') return false
  const entries = Object.values(hours as Record<string, string>)
  return entries.some((entry) => {
    const value = String(entry ?? '').trim().toLowerCase()
    return value && !EMPTY_HOURS.has(value)
  })
}

export default function SettingsTabs({
  activeTab,
  tabs,
  tradeOptions,
  days,
  profile,
  portfolioImages,
  liveSiteUrl,
  onBusinessSave,
  onHoursSave,
  onAccreditationsSave,
  onPortfolioUpload,
}: Props) {
  const initialHasTrade = Boolean(profile.trade_type?.trim())
  const initialHasHours = hasMeaningfulHours(profile.business_hours)
  const initialHasAccreditations = (profile.accreditations ?? []).length > 0
  const initialGalleryCount = portfolioImages.length

  const [businessState, businessAction] = useActionState(
    (_: ActionState, formData: FormData) => onBusinessSave(formData),
    { ok: false } as ActionState
  )
  const [hoursState, hoursAction] = useActionState(
    (_: ActionState, formData: FormData) => onHoursSave(formData),
    { ok: false } as ActionState
  )
  const [accreditationsState, accreditationsAction] = useActionState(
    (_: ActionState, formData: FormData) => onAccreditationsSave(formData),
    { ok: false } as ActionState
  )
  const [portfolioState, portfolioAction] = useActionState(
    (_: ActionState, formData: FormData) => onPortfolioUpload(formData),
    { ok: false } as ActionState
  )

  const galleryCount = portfolioState.galleryCount ?? initialGalleryCount

  const completion = useMemo(() => ({
    trade: businessState.hasTradeType ?? initialHasTrade,
    hours: hoursState.hasHours ?? initialHasHours,
    accreditations: accreditationsState.hasAccreditations ?? initialHasAccreditations,
    galleryCount: galleryCount,
  }), [businessState, hoursState, accreditationsState, galleryCount, initialHasTrade, initialHasHours, initialHasAccreditations])

  const completionPercent = useMemo(() => {
    const hasGallery = completion.galleryCount >= 3
    const completed = [completion.trade, completion.hours, completion.accreditations, hasGallery].filter(Boolean).length
    return completed * 25
  }, [completion])

  const uploadedItems = useMemo(
    () => (portfolioState?.uploaded?.length ? portfolioState.uploaded : []),
    [portfolioState]
  )

  const uploadedUrls = useMemo(() => {
    const next = new Set<string>()
    uploadedItems.forEach((item) => next.add(item.url))
    return next
  }, [uploadedItems])

  const galleryItems = useMemo(() => {
    if (uploadedItems.length === 0) return portfolioImages
    const uploadedAsImages: PortfolioImage[] = uploadedItems.map((item, index) => ({
      id: `${item.name}-${index}`,
      image_url_draft: item.url,
      image_url_published: null,
    }))
    return [...uploadedAsImages, ...portfolioImages]
  }, [uploadedItems, portfolioImages])

  const businessHoursMap = profile.business_hours as Record<string, string> | null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 text-gray-100">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/settings?tab=${tab.id}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-950'
                  : 'border border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {activeTab === 'business' && (
          <form action={businessAction} className="mt-6 grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-200">Business name</label>
              <input
                name="business_name"
                defaultValue={profile.business_name ?? ''}
                className="mt-2 w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                placeholder="NovaTrades Construction"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-200">Trade type</label>
              <select
                name="trade_type"
                defaultValue={profile.trade_type ?? 'other'}
                className="mt-2 w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-100"
              >
                {tradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Changing trade type updates your default template unless you have locked it.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-white"
            >
              Save business profile
            </button>
            {businessState?.ok && (
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} /> Saved
              </div>
            )}
          </form>
        )}

        {activeTab === 'hours' && (
          <form action={hoursAction} className="mt-6 grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              {days.map((day) => (
                <div key={day.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">{day.label}</label>
                  <input
                    name={day.key}
                    defaultValue={businessHoursMap?.[day.key] ?? ''}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    placeholder="08:00 - 17:00"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-white"
            >
              Save business hours
            </button>
            {hoursState?.ok && (
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} /> Hours updated
              </div>
            )}
          </form>
        )}

        {activeTab === 'certifications' && (
          <form action={accreditationsAction} className="mt-6 grid gap-4">
            <AccreditationsField initialItems={profile.accreditations ?? []} />
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-white"
            >
              Save accreditations
            </button>
            {accreditationsState?.ok && (
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} /> Accreditations updated
              </div>
            )}
          </form>
        )}

        {activeTab === 'portfolio' && (
          <div className="mt-6 grid gap-6">
            <form action={portfolioAction} className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Upload portfolio images</label>
                <input
                  type="file"
                  name="portfolio_images"
                  accept="image/*"
                  multiple
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-100 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-900"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Images are uploaded to your secured site-assets bucket.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-white"
                >
                  <UploadCloud size={16} /> Upload to portfolio
                </button>
                {completion.galleryCount > 0 && (
                  <Link
                    href={liveSiteUrl}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:border-gray-500"
                  >
                    View My Site
                  </Link>
                )}
              </div>
              {portfolioState?.ok && (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 size={14} /> Upload complete
                </div>
              )}
            </form>

            {uploadedItems.length > 0 && (
              <div className="grid gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Uploaded
                </p>
                {uploadedItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm text-emerald-200">
                    <span>{item.name}</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs">Success</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-3">
              <p className="text-sm font-medium text-gray-200">Current portfolio</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((image) => {
                  const url = image.image_url_published || image.image_url_draft
                  if (!url) return null
                  const isNew = uploadedUrls.has(url)
                  return (
                    <div
                      key={image.id}
                      className={`relative overflow-hidden rounded-xl border border-gray-800 ${
                        isNew ? 'ring-2 ring-emerald-400/70' : ''
                      }`}
                    >
                      {isNew && (
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-950">
                          New
                        </span>
                      )}
                      <Image
                        src={url}
                        alt="Portfolio image"
                        width={480}
                        height={320}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {completionPercent < 100 && (
        <div className="sticky bottom-4 rounded-2xl border border-gray-800 bg-gray-950/95 px-6 py-4 text-gray-100 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Profile progress
            </span>
            <span className="text-xs text-gray-400">{completionPercent}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-800">
            <div
              className="h-2 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
