export interface Section {
  id: string
  name: string
  content: string
}

export interface SitePage {
  slug: string
  title: string
  sections: Section[]
}

export const mockPages: SitePage[] = [
  {
    slug: 'home',
    title: 'Home',
    sections: [
      { id: 'hero', name: 'Hero', content: 'Welcome to NovaTrades.' },
      { id: 'services', name: 'Services', content: 'Plumbing, Electrical, HVAC.' },
      { id: 'cta', name: 'Call to Action', content: 'Book a quote today.' },
    ],
  },
  {
    slug: 'about',
    title: 'About',
    sections: [
      { id: 'story', name: 'Our Story', content: 'Built by local trades for local trades.' },
      { id: 'values', name: 'Values', content: 'Quality, reliability, trust.' },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    sections: [
      { id: 'details', name: 'Contact Details', content: 'Phone, email, address.' },
      { id: 'form', name: 'Contact Form', content: 'Name, email, message.' },
    ],
  },
]