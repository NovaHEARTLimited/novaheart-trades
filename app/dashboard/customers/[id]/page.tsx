import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CustomerDetailClient from './client'

interface CustomerPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function CustomerDetailPage({ params, searchParams }: CustomerPageProps) {
  const { id } = await params
  const { edit } = await searchParams
  const supabase = await createClient()

  // Fetch customer data
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (!customer) {
    notFound()
  }

  // Count jobs for this customer
  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', id)

  // Fetch recent jobs for this customer
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, estimated_cost, created_at')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <CustomerDetailClient
      customer={customer}
      jobs={jobs || []}
      jobCount={jobCount || 0}
      isEditing={edit === 'true'}
    />
  )
}