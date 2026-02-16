import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import QuoteDetailClient from './client'

interface QuotePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function QuoteDetailPage({ params, searchParams }: QuotePageProps) {
  const { id } = await params
  const { edit } = await searchParams
  const supabase = await createClient()

  // Fetch quote with job and customer data
  const { data: quote } = await supabase
    .from('quotes')
    .select(`
      *,
      jobs (
        id,
        title,
        customers (
          id,
          name,
          email,
          phone
        )
      )
    `)
    .eq('id', id)
    .single()

  if (!quote) {
    notFound()
  }

  // Fetch line items for this quote
  const { data: lineItems } = await supabase
    .from('line_items')
    .select('*')
    .eq('quote_id', id)
    .order('created_at')

  return (
    <QuoteDetailClient
      quote={quote}
      lineItems={lineItems || []}
      isEditing={edit === 'true'}
    />
  )
}