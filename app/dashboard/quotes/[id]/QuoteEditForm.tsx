"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateQuote } from '@/actions/quotes'

interface Quote {
  id: string
  job_id: string
  total_amount: number
  status: string
  valid_until: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

interface QuoteEditFormProps {
  quote: Quote
  lineItems: LineItem[]
  onCancel: () => void
}

export default function QuoteEditForm({ quote, lineItems, onCancel }: QuoteEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await updateQuote(formData)
    } catch (error) {
      console.error('Error updating quote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={quote.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="job_id" className="text-gray-700 font-semibold">Job</Label>
          <Input
            id="job_id"
            name="job_id"
            defaultValue={quote.job_id}
            className="bg-white text-black border-gray-300 mt-1"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="total_amount" className="text-gray-700 font-semibold">Total Amount (£)</Label>
          <Input
            id="total_amount"
            name="total_amount"
            type="number"
            step="0.01"
            defaultValue={quote.total_amount}
            className="bg-white text-black border-gray-300 mt-1"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="status" className="text-gray-700 font-semibold">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={quote.status}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black mt-1"
            disabled={isSubmitting}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <Label htmlFor="valid_until" className="text-gray-700 font-semibold">Valid Until</Label>
          <Input
            id="valid_until"
            name="valid_until"
            type="date"
            defaultValue={quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : ''}
            className="bg-white text-black border-gray-300 mt-1"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-gray-700 font-semibold">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={quote.notes || ''}
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