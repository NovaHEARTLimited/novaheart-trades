'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/jobs', label: 'Jobs' },
  { href: '/dashboard/pipeline', label: 'Pipeline' },
  { href: '/dashboard/scheduler', label: 'Scheduler' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/customers', label: 'Customers' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/website', label: 'Website' },
]

export default function DashboardNav() {
  const pathname = usePathname()
  return (
    <div className="hidden sm:flex sm:space-x-1">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
