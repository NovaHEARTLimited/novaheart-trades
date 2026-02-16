import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActivitiesByJob } from '@/app/dashboard/activities/actions'
import { ActivityTimeline } from '@/app/dashboard/activities/ActivityTimeline'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

async function getJobDetails(jobId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (
        id,
        name,
        email,
        phone
      )
    `)
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Failed to fetch job:', error)
    return null
  }

  return job
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  
  const job = await getJobDetails(id)
  if (!job) notFound()

  const activities = await getActivitiesByJob(id)

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard/jobs"
          className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block"
        >
          ← Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold text-white">{job.title}</h1>
        <div className="flex gap-2 mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            job.status === 'lead' ? 'bg-slate-600 text-slate-200' :
            job.status === 'quoted' ? 'bg-blue-600 text-white' :
            job.status === 'scheduled' ? 'bg-purple-600 text-white' :
            job.status === 'in_progress' ? 'bg-orange-600 text-white' :
            job.status === 'completed' ? 'bg-green-600 text-white' :
            'bg-emerald-600 text-white'
          }`}>
            {job.status?.toUpperCase() || 'LEAD'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Info Card */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Description</label>
                <p className="text-white mt-1">{job.description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Estimated Cost</label>
                  <p className="text-white mt-1 font-semibold">
                    {job.total_value ? `£${job.total_value.toLocaleString()}` : 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Scheduled Date</label>
                  <p className="text-white mt-1">
                    {job.scheduled_date 
                      ? new Date(job.scheduled_date).toLocaleDateString() 
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400">Created</label>
                <p className="text-white mt-1">
                  {new Date(job.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline activities={activities} jobId={id} />
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Customer</h2>
            
            {job.customers ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <p className="text-white mt-1 font-medium">{job.customers.name}</p>
                </div>

                {job.customers.email && (
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <a 
                      href={`mailto:${job.customers.email}`}
                      className="text-blue-400 hover:text-blue-300 mt-1 block"
                    >
                      {job.customers.email}
                    </a>
                  </div>
                )}

                {job.customers.phone && (
                  <div>
                    <label className="text-sm text-slate-400">Phone</label>
                    <a 
                      href={`tel:${job.customers.phone}`}
                      className="text-blue-400 hover:text-blue-300 mt-1 block"
                    >
                      {job.customers.phone}
                    </a>
                  </div>
                )}

                <Link
                  href={`/dashboard/customers/${job.customers.id}`}
                  className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  View customer details →
                </Link>
              </div>
            ) : (
              <p className="text-slate-400">No customer assigned</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                Create Quote
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors">
                Schedule Job
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
