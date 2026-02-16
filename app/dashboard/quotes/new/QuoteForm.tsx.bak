"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createQuote } from '@/actions/quotes'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
}

interface Job {
  id: string
  title: string
  customers: Customer
}

interface QuoteFormProps {
  customers: Customer[]
  jobs: Job[]
}

export default function QuoteForm({ customers, jobs }: QuoteFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [selectedJob, setSelectedJob] = useState<string>('none')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [validUntil, setValidUntil] = useState<string>(DEFAULT_VALID_UNTIL)
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredJobs = selectedCustomer
    ? jobs.filter(job => job.customers?.id === selectedCustomer)
    : jobs

  const handleSubmit = async (status: 'draft' | 'sent') => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set('customer_id', selectedCustomer)
    formData.set('job_id', selectedJob === 'none' ? '' : selectedJob)
    formData.set('title', title)
    formData.set('description', description)
    formData.set('valid_until', validUntil)
    formData.set('notes', notes)
    formData.set('status', status)

    await createQuote(formData)
  }

  return (
    <form action={() => handleSubmit('draft')} className="space-y-6">
      <input type="hidden" id="customer_id_hidden" name="customer_id" value={selectedCustomer} />
      <input type="hidden" id="job_id_hidden" name="job_id" value={selectedJob === 'none' ? '' : selectedJob} />
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold text-2xl">Quote Details</CardTitle>
          <CardDescription className="text-gray-700">Basic information for the quote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_id" className="text-gray-900 font-semibold">Customer *</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="customer_id" className="bg-white text-gray-900 border-gray-300 mt-1">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id} className="text-gray-900">
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="job_id" className="text-gray-900 font-semibold">Related Job (Optional)</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger id="job_id" className="bg-white text-gray-900 border-gray-300 mt-1">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none" className="text-gray-900">None</SelectItem>
                  {filteredJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id} className="text-gray-900">
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="text-gray-900 font-semibold">Title *</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quote title"
              className="bg-white text-gray-900 border-gray-300 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-900 font-semibold">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work..."
              className="bg-white text-gray-900 border-gray-300 mt-1"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="valid_until" className="text-gray-900 font-semibold">Valid Until</Label>
            <Input
              id="valid_until"
              name="valid_until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="bg-white text-gray-900 border-gray-300 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-900 font-semibold">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="bg-white text-gray-900 border-gray-300 mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || !selectedCustomer || !title || !description}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('sent')}
          disabled={isSubmitting || !selectedCustomer || !title || !description}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Send to Customer
        </Button>
        <Link href="/dashboard/quotes">
          <Button type="button" variant="outline" disabled={isSubmitting} className="text-gray-900">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}

const DEFAULT_VALID_UNTIL = (() => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
})()