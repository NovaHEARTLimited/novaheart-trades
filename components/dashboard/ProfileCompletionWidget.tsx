import Link from 'next/link'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { BusinessProfile } from '@/lib/businessProfile'

type MissingKey = 'trade_type' | 'business_hours' | 'accreditations' | 'gallery'

type ActionLinks = Partial<Record<MissingKey, string>>

type Props = {
  profile: BusinessProfile
  businessHours?: string[] | string | Record<string, string> | null
  actionLinks?: ActionLinks
  className?: string
}

const DEFAULT_ACTION_LINKS: ActionLinks = {
  trade_type: '/dashboard/settings?tab=business',
  business_hours: '/dashboard/settings?tab=hours',
  accreditations: '/dashboard/settings?tab=certifications',
  gallery: '/dashboard/settings?tab=portfolio',
}

const EMPTY_HOURS = new Set(['', 'default', 'tbd', 'to be confirmed', 'n/a'])

function hasMeaningfulHours(hours?: string[] | string | Record<string, string> | null) {
  if (!hours) return false
  if (Array.isArray(hours)) {
    return hours.some((entry) => {
      const value = String(entry ?? '').trim().toLowerCase()
      return value && !EMPTY_HOURS.has(value)
    })
  }
  if (typeof hours === 'object') {
    return Object.values(hours).some((entry) => {
      const value = String(entry ?? '').trim().toLowerCase()
      return value && !EMPTY_HOURS.has(value)
    })
  }
  const normalized = String(hours).trim().toLowerCase()
  return normalized.length > 0 && !EMPTY_HOURS.has(normalized)
}

function getMissingMessage(missing: MissingKey) {
  switch (missing) {
    case 'trade_type':
      return "Tell us your trade to unlock your custom template."
    case 'gallery':
      return "Add photos to power up 'The Craftsman' portfolio."
    case 'business_hours':
      return 'Add business hours so clients can plan site visits.'
    case 'accreditations':
      return 'Add accreditations to strengthen procurement confidence.'
    default:
      return 'Complete your profile to unlock the full experience.'
  }
}

export default function ProfileCompletionWidget({
  profile,
  businessHours,
  actionLinks,
  className,
}: Props) {
  const hasTradeType = Boolean(profile.identity.tradeType?.trim())
  const hasHours = hasMeaningfulHours(businessHours)
  const hasAccreditations = (profile.trust.licenses ?? []).length > 0
  const galleryCount = profile.media.gallery?.length ?? 0
  const hasGallery = galleryCount >= 3

  const checks: Array<{ key: MissingKey; label: string; done: boolean }> = [
    { key: 'trade_type', label: 'Trade type', done: hasTradeType },
    { key: 'business_hours', label: 'Business hours', done: hasHours },
    { key: 'accreditations', label: 'Accreditations', done: hasAccreditations },
    { key: 'gallery', label: 'Portfolio images', done: hasGallery },
  ]

  const completed = checks.filter((item) => item.done).length
  const progress = completed * 25
  const firstMissing = checks.find((item) => !item.done)?.key
  const message = firstMissing ? getMissingMessage(firstMissing) : 'Profile complete.'
  const linkTarget = firstMissing
    ? actionLinks?.[firstMissing] ?? DEFAULT_ACTION_LINKS[firstMissing]
    : undefined

  return (
    <section className={`rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm ${className ?? ''}`.trim()}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Profile Completion
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {progress}% complete
          </h2>
        </div>
        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
          {completed}/4 steps
        </span>
      </div>

      <div className="mt-4">
        <div
          className="h-2 w-full rounded-full bg-slate-700"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-2 rounded-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">{message}</p>

      <div className="mt-4 grid gap-2 text-sm text-slate-400">
        {checks.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            {item.done ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-amber-500" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {linkTarget && (
        <div className="mt-6">
          <Link
            className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            href={linkTarget}
          >
            Update now
          </Link>
        </div>
      )}
    </section>
  )
}
