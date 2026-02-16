"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateQuoteStatus } from '@/actions/quotes'

interface StatusSelectorProps {
  quoteId: string
  currentStatus: string
}

export default function StatusSelector({ quoteId, currentStatus }: StatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(newStatus)
    try {
      const formData = new FormData()
      formData.append('id', quoteId)
      formData.append('status', newStatus)
      await updateQuoteStatus(formData)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  ]

  return (
    <div className="flex gap-3">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={currentStatus === option.value ? 'default' : 'outline'}
          disabled={currentStatus === option.value || isUpdating === option.value}
          onClick={() => handleStatusChange(option.value)}
          className={currentStatus === option.value ? option.color : `${option.color} border-0`}
        >
          {isUpdating === option.value ? 'Updating...' : option.label}
        </Button>
      ))}
    </div>
  )
}