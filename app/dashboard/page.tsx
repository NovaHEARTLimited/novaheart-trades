"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import ProfileCompletionWidget from "@/components/dashboard/ProfileCompletionWidget"
import { normalizeBusinessProfile } from "@/lib/businessProfile"
import type { BusinessProfile } from "@/lib/businessProfile"

type Stats = {
  jobs: number
  active: number
  customers: number
  quotes: number
}

const statLabels: Record<keyof Stats, string> = {
  jobs: "Total Jobs",
  active: "Active Jobs",
  customers: "Customers",
  quotes: "Quotes",
}

const SAFE_PROFILE: BusinessProfile = normalizeBusinessProfile({})

export default function DashboardPage() {
  const [profile, setProfile] = useState<BusinessProfile>(SAFE_PROFILE)
  const [businessHours, setBusinessHours] = useState<string[] | null>(null)
  const [businessName, setBusinessName] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({ jobs: 0, active: 0, customers: 0, quotes: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/"); return }

      const [
        { count: j },
        { count: aj },
        { count: c },
        { count: q },
        { data: prof },
      ] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
        supabase.from("customers").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ])

      setStats({ jobs: j ?? 0, active: aj ?? 0, customers: c ?? 0, quotes: q ?? 0 })

      if (prof) {
        const normalized = normalizeBusinessProfile({
          identity: {
            businessName: prof.business_name ?? '',
            tradeType: prof.trade_type ?? '',
            tagline: '',
            shortDescription: '',
            longDescription: '',
          },
          trust: {
            licenses: Array.isArray(prof.accreditations) ? prof.accreditations : [],
            testimonials: [],
            insurance: '',
          },
        })
        setProfile(normalized)
        setBusinessName(prof.business_name ?? null)
        setBusinessHours(prof.business_hours ?? null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-red-900/40 border border-red-700 rounded-xl p-8 max-w-md text-center">
        <p className="text-red-400 font-semibold mb-2">Dashboard Error</p>
        <p className="text-slate-300 text-sm font-mono">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); fetchData() }}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            {businessName && <p className="text-slate-400 mt-1">{businessName}</p>}
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {(Object.keys(stats) as Array<keyof Stats>).map((key) => (
            <div key={key} className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">{statLabels[key]}</p>
              <p className="text-3xl font-bold">{stats[key]}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-64">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <p className="text-slate-400 italic">
                Navigate to Jobs or Customers to manage records.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <ProfileCompletionWidget
              profile={profile}
              businessHours={businessHours}
            />
            <nav className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <ul className="space-y-3">
                <li><Link href="/dashboard/jobs" className="text-blue-400 hover:text-blue-300 transition-colors">Manage Jobs →</Link></li>
                <li><Link href="/dashboard/customers" className="text-blue-400 hover:text-blue-300 transition-colors">Manage Customers →</Link></li>
                <li><Link href="/dashboard/quotes" className="text-blue-400 hover:text-blue-300 transition-colors">Manage Quotes →</Link></li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </div>
  )
}
