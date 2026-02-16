import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold">
            Nova<span className="text-[#2F6BFF]">Trades</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link className="text-sm text-gray-700 hover:text-gray-900" href="/features">Features & Pricing</Link>
            <Link className="text-sm text-gray-700 hover:text-gray-900" href="/services">Services</Link>
            <Link className="text-sm text-gray-700 hover:text-gray-900" href="/stories">Testimonials & FAQ</Link>
            <Link className="text-sm text-gray-700 hover:text-gray-900" href="/contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">Sign in</Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2557D6]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600">© 2026 NovaTrades. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/features">Features</Link>
            <Link href="/services">Services</Link>
            <Link href="/stories">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}