'use client'

import { useState } from 'react'
import { Activity, toggleActivityComplete, deleteActivity } from './actions'
import { AddActivityForm } from './AddActivityForm'

interface ActivityTimelineProps {
  activities: Activity[]
  jobId?: string
  customerId?: string
}

const ACTIVITY_ICONS = {
  note: '📝',
  call: '📞',
  email: '📧',
  task: '✅',
  meeting: '🤝',
}

const ACTIVITY_COLORS = {
  note: 'bg-blue-500',
  call: 'bg-green-500',
  email: 'bg-purple-500',
  task: 'bg-orange-500',
  meeting: 'bg-pink-500',
}

export function ActivityTimeline({ activities, jobId, customerId }: ActivityTimelineProps) {
  const [showForm, setShowForm] = useState(false)
  const [localActivities, setLocalActivities] = useState(activities)

  async function handleToggle(id: string, completed: boolean) {
    setLocalActivities(prev =>
      prev.map(a => (a.id === id ? { ...a, completed: !completed } : a))
    )
    try {
      await toggleActivityComplete(id, !completed)
    } catch (error) {
      // Revert on error
      setLocalActivities(activities)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this activity?')) return
    
    setLocalActivities(prev => prev.filter(a => a.id !== id))
    try {
      await deleteActivity(id)
    } catch (error) {
      setLocalActivities(activities)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Activity'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddActivityForm
            jobId={jobId}
            customerId={customerId}
            onSuccess={() => {
              setShowForm(false)
              window.location.reload()
            }}
          />
        </div>
      )}

      {localActivities.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No activities yet</p>
      ) : (
        <div className="space-y-4">
          {localActivities.map(activity => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`${ACTIVITY_COLORS[activity.type]} w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shrink-0`}>
                  {ACTIVITY_ICONS[activity.type]}
                </div>
                <div className="w-0.5 bg-slate-700 flex-1 mt-2" />
              </div>

              <div className="flex-1 bg-slate-700 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{activity.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {activity.type === 'task' && (
                      <button
                        onClick={() => handleToggle(activity.id, activity.completed)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activity.completed
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        {activity.completed ? 'Completed' : 'Mark Done'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {activity.content && (
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{activity.content}</p>
                )}

                {activity.due_date && (
                  <p className="text-xs text-orange-400 mt-2">
                    📅 Due: {new Date(activity.due_date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
