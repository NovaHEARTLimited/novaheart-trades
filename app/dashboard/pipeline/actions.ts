'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type JobStatus = 'lead' | 'quoted' | 'scheduled' | 'in_progress' | 'completed' | 'paid'

export interface PipelineJob {
  id: string
  title: string
  customer_name: string
  estimated_value: number | null
  status: JobStatus
  created_at: string
  scheduled_date: string | null
}

export async function getPipelineJobs(): Promise<PipelineJob[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Fetch jobs with LEFT JOIN to get customer names
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (jobsError) {
    console.error('Failed to fetch jobs:', jobsError)
    return []
  }

  if (!jobs || jobs.length === 0) return []

  // Get all unique customer IDs
  const customerIds = [...new Set(jobs.map(j => j.customer_id).filter(Boolean))]
  
  // Fetch customer names
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')
    .in('id', customerIds)

  const customerMap = new Map(customers?.map(c => [c.id, c.name]) || [])

  return jobs.map(job => ({
    id: job.id,
    title: job.title || 'Untitled Job',
    customer_name: customerMap.get(job.customer_id) || 'No customer',
    estimated_value: job.total_value,
    status: (job.status || 'lead') as JobStatus,
    created_at: job.created_at,
    scheduled_date: job.scheduled_date,
  }))
}

export async function updateJobStatus(jobId: string, newStatus: JobStatus) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('jobs')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update job status:', error)
    throw new Error('Failed to update job status')
  }

  revalidatePath('/dashboard/pipeline')
  return { success: true }
}
