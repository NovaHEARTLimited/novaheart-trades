'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActivityType = 'note' | 'call' | 'email' | 'task' | 'meeting'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  content: string | null
  due_date: string | null
  completed: boolean
  created_at: string
  job_id: string | null
  customer_id: string | null
}

export async function getActivitiesByJob(jobId: string): Promise<Activity[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch activities:', error)
    return []
  }

  return data as Activity[]
}

export async function getActivitiesByCustomer(customerId: string): Promise<Activity[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch activities:', error)
    return []
  }

  return data as Activity[]
}

export async function getRecentActivities(limit = 10): Promise<Activity[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch activities:', error)
    return []
  }

  return data as Activity[]
}

export interface CreateActivityInput {
  type: ActivityType
  title: string
  content?: string
  due_date?: string
  job_id?: string
  customer_id?: string
}

export async function createActivity(input: CreateActivityInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      type: input.type,
      title: input.title,
      content: input.content || null,
      due_date: input.due_date || null,
      job_id: input.job_id || null,
      customer_id: input.customer_id || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create activity:', error)
    throw new Error('Failed to create activity')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
  revalidatePath('/dashboard/customers')
  
  return data
}

export async function updateActivity(id: string, updates: Partial<CreateActivityInput>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('activities')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update activity:', error)
    throw new Error('Failed to update activity')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
  revalidatePath('/dashboard/customers')
  
  return { success: true }
}

export async function toggleActivityComplete(id: string, completed: boolean) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('activities')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to toggle activity:', error)
    throw new Error('Failed to toggle activity')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
  revalidatePath('/dashboard/customers')
  
  return { success: true }
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete activity:', error)
    throw new Error('Failed to delete activity')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
  revalidatePath('/dashboard/customers')
  
  return { success: true }
}
