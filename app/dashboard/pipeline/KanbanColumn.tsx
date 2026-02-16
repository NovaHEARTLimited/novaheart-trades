'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { JobCard } from './JobCard'
import type { PipelineJob, JobStatus } from './actions'

interface KanbanColumnProps {
  status: JobStatus
  title: string
  jobs: PipelineJob[]
  color: string
}

export function KanbanColumn({ status, title, jobs, color }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="w-80 shrink-0">
      <div className={`rounded-lg border-2 ${color} bg-slate-800 p-4 h-full min-h-[600px]`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">{title}</h2>
          <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2 py-1 rounded-full">
            {jobs.length}
          </span>
        </div>
        
        <div ref={setNodeRef} className="space-y-3">
          <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </SortableContext>
          
          {jobs.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-8">No jobs</p>
          )}
        </div>
      </div>
    </div>
  )
}
