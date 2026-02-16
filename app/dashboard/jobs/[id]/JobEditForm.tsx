"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateJob } from '@/actions/jobs'

interface Job {
  id: string
  title: string
  description: string | null
  status: string
  customer_id: string | null
  estimated_cost: number | null
  actual_cost: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  name: string
  email: string | null
}

interface JobEditFormProps {
  job: Job
  customers: Customer[]
  onCancel: () => void
}

export default function JobEditForm({ job, customers, onCancel }: JobEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await updateJob(formData)
    } catch (error) {
      console.error('Error updating job:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={job.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title" className="text-gray-700 font-semibold">Job Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={job.title}
            className="bg-white text-black border-gray-300 mt-1"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="customer_id" className="text-gray-700 font-semibold">Customer</Label>
          <Select name="customer_id" defaultValue={job.customer_id || ''} disabled={isSubmitting}>
            <SelectTrigger className="bg-white text-black border-gray-300 mt-1">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" className="text-black">No Customer</SelectItem>
              {customers?.map((customer) => (
                <SelectItem key={customer.id} value={customer.id} className="text-black">
                  {customer.name} - {customer.email || 'No email'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-700 font-semibold">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={job.description || ''}
          className="bg-white text-black border-gray-300 mt-1"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="estimated_cost" className="text-gray-700 font-semibold">Estimated Cost (£)</Label>
          <Input
            id="estimated_cost"
            name="estimated_cost"
            type="number"
            step="0.01"
            defaultValue={job.estimated_cost || ''}
            className="bg-white text-black border-gray-300 mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="start_date" className="text-gray-700 font-semibold">Scheduled Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={job.start_date ? new Date(job.start_date).toISOString().split('T')[0] : ''}
            className="bg-white text-black border-gray-300 mt-1"
            disabled={isSubmitting}
          />
        </div>
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