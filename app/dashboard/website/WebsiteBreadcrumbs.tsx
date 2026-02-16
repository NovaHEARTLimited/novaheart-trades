'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function titleize(segment: string) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function WebsiteBreadcrumbs() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)

  const websiteIndex = parts.indexOf('website')
  if (websiteIndex === -1) return null

  const crumbs = parts.slice(0, websiteIndex + 1)
  const rest = parts.slice(websiteIndex + 1)

  const items = [
    { href: '/dashboard/website', label: 'Website' },
    ...rest.map((seg, i) => ({
      href: '/' + [...parts.slice(0, websiteIndex + 1 + i + 1)].join('/'),
      label: titleize(seg),
    })),
  ]

  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {i === items.length - 1 ? (
              <span className="text-gray-700">{item.label}</span>
            ) : (
              <Link className="hover:text-gray-700" href={item.href}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}