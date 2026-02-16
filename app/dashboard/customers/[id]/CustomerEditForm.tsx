"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCustomer } from '@/actions/customers'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface CustomerEditFormProps {
  customer: Customer
  onCancel: () => void
}

export default function CustomerEditForm({ customer, onCancel }: CustomerEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await updateCustomer(formData)
    } catch (error) {
      console.error('Error updating customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={customer.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-gray-700 font-semibold">Customer Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={customer.name}
            className="bg-white text-black border-gray-300 mt-1"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email || ''}
            className="bg-white text-black border-gray-300 mt-1"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={customer.phone || ''}
            className="bg-white text-black border-gray-300 mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-gray-700 font-semibold">Address</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={customer.address || ''}
            className="bg-white text-black border-gray-300 mt-1"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-gray-700 font-semibold">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={customer.notes || ''}
          className="bg-white text-black border-gray-300 mt-1"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}