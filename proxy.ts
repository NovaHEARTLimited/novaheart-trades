import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPublicSiteByDomain } from '@/lib/website/public'

function normalizeHost(host: string) {
  return host.replace(/:\d+$/, '').replace(/^www\./, '')
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/site') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')
  ) {
    return NextResponse.next()
  }

  const host = normalizeHost(req.headers.get('host') || '')
  if (!host) return NextResponse.next()

  const site = await getPublicSiteByDomain(host)
  if (!site?.slug) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/site/${site.slug}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/:path*'],
}
