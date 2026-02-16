export interface Template {
  id: string
  name: string
  description: string
  image?: string
  tags?: string[]
}

export const templates: Template[] = [
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    description: 'Clean, bold layout for agencies and studios.',
    tags: ['Agency', 'Portfolio'],
  },
  {
    id: 'local-pro',
    name: 'Local Pro',
    description: 'Service-first layout for local businesses.',
    tags: ['Service', 'Local'],
  },
  {
    id: 'trade-grid',
    name: 'Trade Grid',
    description: 'Practical layout for trades and contractors.',
    tags: ['Trades', 'Lead Gen'],
  },
  {
    id: 'consult-classic',
    name: 'Consult Classic',
    description: 'Professional look for consultants and firms.',
    tags: ['Consulting', 'Business'],
  },
  {
    id: 'shop-lite',
    name: 'Shop Lite',
    description: 'Simple commerce-ready landing layout.',
    tags: ['Retail', 'Landing'],
  },
]
