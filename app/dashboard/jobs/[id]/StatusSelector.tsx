"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateJobStatus } from '@/actions/jobs'

interface StatusSelectorProps {
  jobId: string
  currentStatus: string
}

export default function StatusSelector({ jobId, currentStatus }: StatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(newStatus)
    try {
      const formData = new FormData()
      formData.append('id', jobId)
      formData.append('status', newStatus)
      await updateJobStatus(formData)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
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