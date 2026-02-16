import LiveStats from '../components/landing/LiveStats'
import TemplateShowcase from '../components/landing/TemplateShowcase'
import Link from 'next/link'
import { templates } from '@/lib/templates/registry'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-full bg-[#0070FF]/30 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            NovaTrades
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            The Growth Machine for Modern Trades
          </h1>
          <p className="mt-6 text-base text-white/70 sm:text-lg">
            Launch a premium trade website in minutes. Capture more leads, showcase your work, and lock in a
            professional presence with NovaHEART-grade design.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <button className="w-full rounded-lg bg-[#0070FF] px-8 py-4 font-bold hover:bg-[#005ecb]">
                Get Started Free
              </button>
            </Link>
            <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white">
              Sign In
            </Link>
          </div>
          <div className="mt-10">
            <LiveStats />
          </div>
        </div>
      </section>
      <section id="showcase" className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Template Showcase</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">Live Trades</span>
          </div>
          <TemplateShowcase templates={templates} />
        </div>
      </section>
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/60">
        <p>Owned and Powered by NovaHEART Limited (Company No. 16625905).</p>
        <p className="mt-2">
          <a href="mailto:support@novatrades.uk" className="hover:text-white">
            support@novatrades.uk
          </a>
        </p>
      </footer>
    </main>
  )
}


