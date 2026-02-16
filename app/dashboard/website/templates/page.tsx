'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { applyTemplateWithAI } from '@/lib/website/apply-template-with-ai'

export default function TemplatesPage() {
  const router = useRouter()
  const [onboardingData, setOnboardingData] = useState<{
    businessName: string
    tradeType: string
    services: string[]
    location: string
    phone: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const loadData = () => {
      const data = localStorage.getItem('nova_onboarding_data')
      if (!data) {
        router.push('/onboarding')
        return
      }
      setOnboardingData(JSON.parse(data))
    }
    loadData()
  }, [router])

  const handleSelectTemplate = async (templateId: string) => {
    if (!onboardingData) return
    
    setLoading(true)
    
    try {
      setStatus('Analyzing your business...')
      await new Promise(r => setTimeout(r, 500))
      
      setStatus('Creating your website...')
      const slug = await applyTemplateWithAI(templateId, onboardingData)
      
      setStatus('Finalizing...')
      localStorage.removeItem('nova_onboarding_data')
      
      // Give it a moment before redirect
      await new Promise(r => setTimeout(r, 500))
      router.push(`/site/${slug}/home`)
      
    } catch (err) {
      console.error('Template application failed:', err)
      alert('Failed to create site. Please try again or contact support.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <h2 className="text-2xl font-bold">Building Your Site</h2>
        <p className="text-slate-400">{status}</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Choose a Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 space-y-4 hover:border-blue-500 cursor-pointer transition-all" 
          onClick={() => handleSelectTemplate('classic')}
        >
          <div className="aspect-video bg-blue-600 rounded-lg flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-white">Classic Trades</h3>
            <p className="text-sm text-blue-100">Professional & Trustworthy</p>
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">
            Select Template
          </button>
        </div>
        
        <div 
          className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 space-y-4 hover:border-blue-500 cursor-pointer transition-all" 
          onClick={() => handleSelectTemplate('modern')}
        >
          <div className="aspect-video bg-purple-600 rounded-lg flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white">Modern Pro</h3>
            <p className="text-sm text-purple-100">Bold & Contemporary</p>
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">
            Select Template
          </button>
        </div>
      </div>
    </div>
  )
}
