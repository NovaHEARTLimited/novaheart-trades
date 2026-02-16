'use client'

import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { JobCard } from './JobCard'
import { getPipelineJobs, updateJobStatus, type PipelineJob, type JobStatus } from './actions'

const STAGES = [
  { status: 'lead' as JobStatus, title: 'Leads', color: 'border-slate-600' },
  { status: 'quoted' as JobStatus, title: 'Quoted', color: 'border-blue-500' },
  { status: 'scheduled' as JobStatus, title: 'Scheduled', color: 'border-purple-500' },
  { status: 'in_progress' as JobStatus, title: 'In Progress', color: 'border-orange-500' },
  { status: 'completed' as JobStatus, title: 'Completed', color: 'border-green-500' },
  { status: 'paid' as JobStatus, title: 'Paid', color: 'border-emerald-500' },
]

export default function PipelinePage() {
  const [jobs, setJobs] = useState<PipelineJob[]>([])
  const [activeJob, setActiveJob] = useState<PipelineJob | null>(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  async function loadJobs() {
    setLoading(true)
    const data = await getPipelineJobs()
    console.log('Loaded jobs:', data)
    setJobs(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadJobs()
  }, [])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveJob(null)

    if (!over || active.id === over.id) return

    const jobId = active.id as string
    const newStatus = over.id as JobStatus

    // Optimistic update
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ))

    try {
      await updateJobStatus(jobId, newStatus)
    } catch (error) {
      console.error('Failed to update job status:', error)
      await loadJobs()
    }
  }

  function handleDragStart(event: DragEndEvent) {
    const job = jobs.find(j => j.id === event.active.id)
    setActiveJob(job || null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-slate-400">Loading pipeline...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Job Pipeline</h1>
        <p className="text-slate-400 mt-1">Drag jobs between stages</p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage.status}
              status={stage.status}
              title={stage.title}
              color={stage.color}
              jobs={jobs.filter(job => job.status === stage.status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeJob ? <JobCard job={activeJob} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
