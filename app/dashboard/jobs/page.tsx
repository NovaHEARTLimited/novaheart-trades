import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Job = {
  id: string
  title: string
  status: string
  created_at: string
  estimated_cost: number | null
  customers: { name: string } | null
}

export default async function JobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      status,
      created_at,
      estimated_cost,
      customers (
        name
      )
    `)
    .order('created_at', { ascending: false })

  const jobList: Job[] = (jobs ?? []).map((job) => ({
    id: job.id,
    title: job.title,
    status: job.status,
    created_at: job.created_at,
    estimated_cost: job.estimated_cost,
    customers: Array.isArray(job.customers)
      ? (job.customers[0] ?? null)
      : (job.customers ?? null),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-slate-400">Manage your jobs and projects</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">
            Create New Job
          </Button>
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {jobList.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Estimated Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {jobList.map((job) => (
                <tr key={job.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {job.customers?.name || 'No Customer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                      job.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {job.estimated_cost ? `£${job.estimated_cost.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No jobs yet</p>
            <p className="text-slate-500 text-sm mt-2">Create your first job to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
