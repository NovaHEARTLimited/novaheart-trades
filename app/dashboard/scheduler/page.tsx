import { getScheduledJobs } from './actions'
import { SchedulerCalendar } from './SchedulerCalendar'
import Link from 'next/link'

export default async function SchedulerPage() {
  const jobs = await getScheduledJobs()

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Scheduler</h1>
          <p className="text-slate-400 mt-1">View and manage your job schedule</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-slate-400 text-lg">No scheduled jobs</p>
          <p className="text-slate-500 text-sm mt-2">
            Schedule jobs from the Jobs or Pipeline pages
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-4">
            <div className="bg-slate-800 rounded-lg p-4 flex-1">
              <p className="text-sm text-slate-400">Total Scheduled</p>
              <p className="text-2xl font-bold text-white mt-1">{jobs.length}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 flex-1">
              <p className="text-sm text-slate-400">This Week</p>
              <p className="text-2xl font-bold text-white mt-1">
                {jobs.filter(j => {
                  const jobDate = new Date(j.scheduled_date)
                  const now = new Date()
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                  return jobDate >= now && jobDate <= weekFromNow
                }).length}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 flex-1">
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                £{jobs.reduce((sum, j) => sum + (j.total_value || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          <SchedulerCalendar jobs={jobs} />
        </>
      )}
    </div>
  )
}
