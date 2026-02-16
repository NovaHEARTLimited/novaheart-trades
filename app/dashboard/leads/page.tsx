import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  service: string | null
  source: string
  status: string
  created_at: string
}

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const leadList: Lead[] = leads || []

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Leads</h1>
        <p className="text-slate-400 mt-1">Manage leads captured from your website</p>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {leadList.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {leadList.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      {lead.message && (
                        <div className="text-xs text-slate-400 truncate max-w-xs mt-1">
                          {lead.message}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">
                      <a href={`mailto:${lead.email}`} className="text-blue-400 hover:text-blue-300 block">
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="text-slate-400 hover:text-slate-300 block">
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {lead.service || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      lead.status === 'contacted' ? 'bg-purple-500/20 text-purple-400' :
                      lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                      lead.status === 'converted' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {lead.source === 'website' ? '🌐 Website' : lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No leads yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Leads will appear here when visitors submit your website contact form
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
