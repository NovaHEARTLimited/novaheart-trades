'use client'

import { useState } from 'react'
import { createActivity, type ActivityType } from './actions'

interface AddActivityFormProps {
  jobId?: string
  customerId?: string
  onSuccess?: () => void
}

export function AddActivityForm({ jobId, customerId, onSuccess }: AddActivityFormProps) {
  const [type, setType] = useState<ActivityType>('note')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await createActivity({
        type,
        title: title.trim(),
        content: content.trim() || undefined,
        due_date: dueDate || undefined,
        job_id: jobId,
        customer_id: customerId,
      })

      // Reset form
      setTitle('')
      setContent('')
      setDueDate('')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create activity:', error)
      alert('Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType)}
          className="w-full bg-slate-600 text-white rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
        >
          <option value="note">📝 Note</option>
          <option value="call">📞 Call</option>
          <option value="email">📧 Email</option>
          <option value="task">✅ Task</option>
          <option value="meeting">🤝 Meeting</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Called customer about quote"
          required
          className="w-full bg-slate-600 text-white rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Details</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add notes..."
          rows={3}
          className="w-full bg-slate-600 text-white rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      {type === 'task' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-slate-600 text-white rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        {loading ? 'Adding...' : 'Add Activity'}
      </button>
    </form>
  )
}
