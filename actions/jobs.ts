'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createJob(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const customerId = formData.get('customer_id')?.toString() || null
  const estimatedCostStr = formData.get('estimated_cost') as string

  if (!title || title.trim() === '') {
    redirect('/dashboard/jobs/new?message=Job title is required')
  }

  const baseData = {
    title: title.trim(),
    description: description || null,
    user_id: user.id,
    status: 'new',
    estimated_cost: estimatedCostStr ? parseFloat(estimatedCostStr) : null,
  }

  const data = customerId && customerId !== 'none' 
    ? { ...baseData, customer_id: customerId }
    : baseData

  console.log('Creating job with data:', data)

  const { error } = await supabase
    .from('jobs')
    .insert(data)

  if (error) {
    console.error('Error creating job:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    redirect('/dashboard/jobs/new?message=Failed to create job: ' + error.message)
  }

  console.log('Job created successfully')

  revalidatePath('/dashboard/jobs')
  redirect('/dashboard')
}

export async function updateJob(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const customerId = formData.get('customer_id') as string

  const data: any = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : null,
    start_date: formData.get('start_date') ? new Date(formData.get('start_date') as string).toISOString() : null,
  }

  // Only include customer_id if it's not empty
  if (customerId && customerId !== '') {
    data.customer_id = customerId
  } else {
    data.customer_id = null
  }

  console.log('Updating job with data:', data)

  const { error } = await supabase
    .from('jobs')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own jobs

  if (error) {
    console.error('Error updating job:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    redirect(`/dashboard/jobs/${id}?edit=true&message=Failed to update job: ${error.message}`)
  }

  console.log('Job updated successfully')

  revalidatePath(`/dashboard/jobs/${id}`)
  redirect(`/dashboard/jobs/${id}`)
}

export async function updateJobStatus(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const data: any = {
    status: status,
  }

  // If status is completed, set end_date
  if (status === 'completed') {
    data.end_date = new Date().toISOString()
  }

  console.log('Updating job status:', data)

  const { error } = await supabase
    .from('jobs')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating job status:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    redirect(`/dashboard/jobs/${id}?message=Failed to update status: ${error.message}`)
  }

  console.log('Job status updated successfully')

  revalidatePath(`/dashboard/jobs/${id}`)
  redirect(`/dashboard/jobs/${id}`)
}