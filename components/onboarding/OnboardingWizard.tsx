"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { upsertBusinessIdentityAction } from "@/app/onboarding/actions"

const TRADE_OPTIONS = [
  { value: "Plumber", label: "Plumber" },
  { value: "Electrician", label: "Electrician" },
  { value: "Carpenter", label: "Carpenter" },
  { value: "Roofer", label: "Roofer" },
  { value: "Landscaper", label: "Landscaper" },
  { value: "Other", label: "Other / Not Listed" },
]

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState("")
  const [tradeType, setTradeType] = useState(TRADE_OPTIONS[0].value)
  const [location, setLocation] = useState("") 
  const [services, setServices] = useState("") 
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleNext() {
    setSaving(true)
    try {
      // Logic for step 1
      await upsertBusinessIdentityAction({ businessName, tradeType })
      setStep(2)
    } catch (error) {
      console.error("Error saving business identity:", error)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoUpload() {
    if (!logoFile) return
    setUploading(true)
    setUploadSuccess(false)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.storage
        .from("logos")
        .upload(`${Date.now()}-${logoFile.name}`, logoFile, { upsert: true })
      
      if (error) {
        console.error("Upload error:", error)
        return
      }
      setUploadSuccess(true)
      setTimeout(() => setStep(3), 800)
    } catch (err) {
      console.error("Unexpected upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  function handleConfirm() {
    const aiData = {
      businessName,
      tradeType,
      location,
      services: services.split(',').map(s => s.trim()).filter(s => s !== ""), 
    }
    localStorage.setItem("nova_onboarding_data", JSON.stringify(aiData))
    
    setConfirmation(true)
    setTimeout(() => router.push("/dashboard/website/templates"), 1500)
  }

  if (confirmation) {
    return (
      <div className="p-8 text-center bg-white rounded shadow text-black max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-2">Success!</h2>
        <p className="text-gray-600">Your profile is ready. Redirecting to pick your template...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-black">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Business Info</h2>
          <div>
            <label className="block mb-1 text-sm font-medium">Business Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="e.g. NovaHEART Construction"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Primary Trade</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={tradeType}
              onChange={e => setTradeType(e.target.value)}
              required
            >
              {TRADE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Service Area (Location)</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="e.g. London, UK"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleNext}
            disabled={saving || !businessName || !location}
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 2: Brand Identity</h2>
          <p className="text-sm text-gray-500">Upload your logo for the website.</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={e => {
              setLogoFile(e.target.files?.[0] || null)
              setUploadSuccess(false)
            }}
          />
          <button
            type="button"
            className="w-full border-2 border-dashed border-blue-200 text-blue-600 px-4 py-8 rounded hover:bg-blue-50 transition"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {logoFile ? `Selected: ${logoFile.name}` : "Click to select Logo"}
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => setStep(3)}
            >
              Skip
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded font-bold text-white transition ${
                uploadSuccess ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleLogoUpload}
              disabled={uploading || !logoFile}
            >
              {uploading ? "Uploading..." : uploadSuccess ? "Success!" : "Upload Logo"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 3: Your Services</h2>
          <p className="text-sm text-gray-500">List what you do (separated by commas).</p>
          
          <div>
            <textarea
              className="w-full border border-gray-300 px-3 py-2 rounded h-24"
              placeholder="Kitchen Fitting, Flooring..."
              value={services}
              onChange={e => setServices(e.target.value)}
              required
            />
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 text-white px-4 py-3 rounded font-bold hover:bg-green-700 transition"
            disabled={!services}
          >
            Finish & Create Website
          </button>
        </div>
      )}
    </div>
  )
}
