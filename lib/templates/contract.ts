import type { BusinessProfile } from '../businessProfile'

export type TemplateId =
  | 'template-1'
  | 'template-2'
  | 'template-3'

export type TradeCategory =
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'landscaping'
  | 'general_contracting'
  | 'hvac'
  | 'other'

export const TEMPLATE_METADATA = {
  'template-1': {
    name: 'Emergency Responder',
    description: 'Lead Gen Focus',
  },
  'template-2': {
    name: 'The Craftsman',
    description: 'Visual Portfolio',
  },
  'template-3': {
    name: 'Commercial Pro',
    description: 'Authority/B2B',
  },
} as const

export function isValidTemplate(id: string): id is TemplateId {
  return id in TEMPLATE_METADATA
}

export function normalizeTradeCategory(input: string): TradeCategory {
  const value = input.toLowerCase()
  if (value.includes('plumb')) return 'plumbing'
  if (value.includes('electric')) return 'electrical'
  if (value.includes('carpenter') || value.includes('joiner') || value.includes('wood'))
    return 'carpentry'
  if (value.includes('landscape') || value.includes('garden')) return 'landscaping'
  if (value.includes('general') || value.includes('contract')) return 'general_contracting'
  if (value.includes('hvac') || value.includes('heating') || value.includes('cool')) return 'hvac'
  return 'other'
}

export function assignDefaultTemplate(trade: TradeCategory): TemplateId {
  switch (trade) {
    case 'plumbing':
    case 'electrical':
      return 'template-1'
    case 'carpentry':
    case 'landscaping':
      return 'template-2'
    case 'general_contracting':
    case 'hvac':
      return 'template-3'
    case 'other':
    default:
      return 'template-1'
  }
}

export type TemplateMeta = {
  id: TemplateId
  name: string
  description: string
  tags: string[]
}

export type TemplateRenderProps = {
  profile: BusinessProfile
}

export type TemplateDefinition = TemplateMeta & {
  previewImageUrl?: string
}