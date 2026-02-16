import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getLockedSiteCount() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('sites')
      .select('id', { count: 'exact', head: true })
      .eq('is_template_locked', true)
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const lockedCount = await getLockedSiteCount()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-6">
        NovaTrades
      </p>

      <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight max-w-3xl mb-6">
        The Growth Machine for Modern Trades
      </h1>

      <p className="text-lg text-gray-500 max-w-xl mb-10">
        Launch a premium trade website in minutes. Capture more leads, showcase your work,
        and lock in a professional presence with NovaHEART-grade design.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
        <Link
          href="/signup"
          className="rounded-xl bg-[#2F6BFF] px-8 py-4 text-base font-bold text-white hover:bg-[#2557D6] transition-colors shadow-lg shadow-blue-200"
        >
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Sign In
        </Link>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Locked Sites
        </span>
        <span className="text-xs font-bold text-gray-900">{lockedCount}</span>
      </div>
    </div>
  )
}
