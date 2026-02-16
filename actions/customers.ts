'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
    user_id: user.id,
  }

  const { error } = await supabase
    .from('customers')
    .insert(data)

  if (error) {
    console.error('Error creating customer:', error)
    redirect('/dashboard/customers/new?message=Failed to create customer')
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard')
}

export async function updateCustomer(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const id = formData.get('id') as string

  const data: any = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
  }

  console.log('Updating customer with data:', data)

  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own customers

  if (error) {
    console.error('Error updating customer:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    redirect(`/dashboard/customers/${id}?edit=true&message=Failed to update customer: ${error.message}`)
  }

  console.log('Customer updated successfully')

  revalidatePath(`/dashboard/customers/${id}`)
  redirect(`/dashboard/customers/${id}`)
}