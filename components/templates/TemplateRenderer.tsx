import type { BusinessProfile } from '@/lib/businessProfile'
import type { TemplateId } from '@/lib/templates/contract'
import { isValidTemplate } from '@/lib/templates/contract'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'

type Props = {
  profile: BusinessProfile
  siteSlug: string
}

function isProfileIncomplete(profile: BusinessProfile) {
  const { identity } = profile
  return !identity?.businessName || !identity?.tradeType || !identity?.tagline
}

function resolveTemplateId(raw: string | undefined): TemplateId {
  if (raw && isValidTemplate(raw)) return raw
  return 'template-1'
}

export default function TemplateRenderer({ profile, siteSlug }: Props) {
  if (isProfileIncomplete(profile)) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Incomplete</h2>
          <p className="mt-3 text-gray-600">
            Add your business name, trade type, and tagline to publish your site.
          </p>
        </div>
      </section>
    )
  }

  const id = resolveTemplateId(profile.site?.templateId)

  switch (id) {
    case 'template-2':
      return <TemplateTwo profile={profile} siteSlug={siteSlug} />
    case 'template-3':
      return <TemplateThree profile={profile} />
    case 'template-1':
    default:
      return <TemplateOne profile={profile} siteSlug={siteSlug} />
  }
}
