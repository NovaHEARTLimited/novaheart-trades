'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface AISuggestionProps {
  sectionName: string
  pageTitle: string
  currentContent: string
  onInsert: (content: string) => void
}

export default function AISuggestion({
  sectionName,
  pageTitle,
  currentContent,
  onInsert,
}: AISuggestionProps) {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [error, setError] = useState('')

  async function generateSuggestion(promptType: string) {
    setLoading(true)
    setError('')
    setSuggestion('')

    const prompts: Record<string, string> = {
      write: `Write engaging ${sectionName} content for a trade business website.`,
      improve: `Improve this text: "${currentContent}"`,
      shorter: `Make this more concise: "${currentContent}"`,
      professional: `Rewrite this in a more professional tone: "${currentContent}"`,
    }

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompts[promptType],
          sectionName,
          pageTitle,
          businessType: 'trade business',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate suggestion')
      }

      setSuggestion(data.suggestion)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-blue-600" />
        <span className="text-xs font-semibold text-blue-900">AI Assistant</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => generateSuggestion('write')}
          disabled={loading}
          className="rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 px-2 py-1 text-xs font-medium text-white transition-colors"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Write content'}
        </button>
        {currentContent && (
          <>
            <button
              type="button"
              onClick={() => generateSuggestion('improve')}
              disabled={loading}
              className="rounded-md border border-blue-200 hover:bg-blue-100 disabled:bg-gray-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors"
            >
              Improve
            </button>
            <button
              type="button"
              onClick={() => generateSuggestion('shorter')}
              disabled={loading}
              className="rounded-md border border-blue-200 hover:bg-blue-100 disabled:bg-gray-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors"
            >
              Make shorter
            </button>
            <button
              type="button"
              onClick={() => generateSuggestion('professional')}
              disabled={loading}
              className="rounded-md border border-blue-200 hover:bg-blue-100 disabled:bg-gray-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors"
            >
              More professional
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="space-y-2">
          <div className="rounded-md bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800">
            {suggestion}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onInsert(suggestion)
                setSuggestion('')
              }}
              className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-xs font-medium text-white transition-colors"
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion('')}
              className="rounded-md border border-gray-200 hover:bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
