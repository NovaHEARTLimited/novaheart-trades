'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ScheduledJob {
  id: string
  title: string
  description: string | null
  scheduled_date: string
  status: string
  customer_name: string
  customer_id: string
  total_value: number | null
}

export async function getScheduledJobs(): Promise<ScheduledJob[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .not('scheduled_date', 'is', null)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Failed to fetch scheduled jobs:', error)
    return []
  }

  if (!jobs || jobs.length === 0) return []

  // Get customer names
  const customerIds = [...new Set(jobs.map(j => j.customer_id).filter(Boolean))]
  
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')
    .in('id', customerIds)

  const customerMap = new Map(customers?.map(c => [c.id, c.name]) || [])

  return jobs.map(job => ({
    id: job.id,
    title: job.title || 'Untitled Job',
    description: job.description,
    scheduled_date: job.scheduled_date,
    status: job.status || 'scheduled',
    customer_name: customerMap.get(job.customer_id) || 'No customer',
    customer_id: job.customer_id,
    total_value: job.total_value,
  }))
}

export async function updateJobSchedule(jobId: string, newDate: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('jobs')
    .update({ 
      scheduled_date: newDate,
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update job schedule:', error)
    throw new Error('Failed to update job schedule')
  }

  revalidatePath('/dashboard/scheduler')
  return { success: true }
}
