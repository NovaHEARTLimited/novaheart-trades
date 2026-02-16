'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PipelineJob } from './actions'

interface JobCardProps {
  job: PipelineJob
}

export function JobCard({ job }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-slate-200 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-slate-900 mb-1">{job.title}</h3>
      <p className="text-sm text-slate-600 mb-2">{job.customer_name}</p>
      
      {job.estimated_value && (
        <p className="text-sm font-medium text-green-600">
          £{job.estimated_value.toLocaleString()}
        </p>
      )}
      
      {job.scheduled_date && (
        <p className="text-xs text-slate-500 mt-2">
          📅 {new Date(job.scheduled_date).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
