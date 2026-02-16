import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function LiveStats() {
  const { count } = await supabase
    .from('sites')
    .select('*', { count: 'exact', head: true })
    .eq('is_template_locked', true)

  const lockedCount = typeof count === 'number' ? count : 0

  return (
    <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
      <span className="text-[0.55rem]">Locked sites</span>
      <span className="text-base font-extrabold text-[#0070FF]">{lockedCount.toLocaleString()}</span>
    </div>
  )
}