import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import QuoteForm from './QuoteForm'

export default async function NewQuotePage() {
  const supabase = await createClient()

  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, name, email')
    .order('name')

  if (customersError) {
    throw new Error(customersError.message)
  }

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      customers!inner (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (jobsError) {
    throw new Error(jobsError.message)
  }

  const transformedJobs =
    jobs?.map(
      (job: {
        id: string
        title: string
        customers:
          | { id: string; name: string; email: string }
          | { id: string; name: string; email: string }[]
          | null
      }) => ({
        id: job.id,
        title: job.title,
        customers: Array.isArray(job.customers) ? job.customers[0] : job.customers
      })
    ).filter(
      (job): job is { id: string; title: string; customers: { id: string; name: string; email: string } } =>
        job.customers !== null
    ) || []

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 font-medium">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/quotes" className="text-gray-900 hover:text-blue-600 font-medium">Quotes</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Quote</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Quote</h1>
        <p className="text-gray-700 font-medium mt-1">Generate a professional quote for your customer</p>
      </div>

      <QuoteForm customers={customers || []} jobs={transformedJobs} />
    </div>
  )
}