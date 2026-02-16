'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TRADE_TYPES = [
  'Plumber', 'Electrician', 'Builder', 'Carpenter', 'Roofer',
  'Painter & Decorator', 'Heating Engineer', 'Landscaper',
  'Kitchen Fitter', 'Bathroom Fitter', 'General Handyman', 'Other'
]

const COMMON_SERVICES: Record<string, string[]> = {
  'Plumber': ['Emergency Repairs', 'Boiler Installation', 'Bathroom Fitting', 'Leak Detection', 'Central Heating', 'Drain Unblocking'],
  'Electrician': ['Rewiring', 'Fuse Box Upgrades', 'PAT Testing', 'Emergency Callouts', 'EV Charger Installation', 'LED Lighting'],
  'Builder': ['Extensions', 'Loft Conversions', 'New Builds', 'Refurbishment', 'Groundwork', 'Brickwork'],
  'Carpenter': ['Bespoke Furniture', 'Kitchen Fitting', 'Door Installation', 'Flooring', 'Decking', 'Wardrobes'],
  'Roofer': ['Roof Repairs', 'New Roofs', 'Flat Roofing', 'Guttering', 'Chimney Repairs', 'Fascias'],
  'Painter & Decorator': ['Interior Painting', 'Exterior Painting', 'Wallpapering', 'Spray Painting', 'Commercial Painting', 'Woodwork'],
  'Heating Engineer': ['Boiler Repairs', 'Central Heating', 'Power Flushing', 'Radiators', 'Underfloor Heating', 'Servicing'],
  'Landscaper': ['Garden Design', 'Paving', 'Fencing', 'Artificial Grass', 'Decking', 'Turfing'],
  'Kitchen Fitter': ['Full Kitchen Install', 'Worktops', 'Appliances', 'Kitchen Design', 'Unit Replacement', 'Tiling'],
  'Bathroom Fitter': ['Complete Bathrooms', 'Showers', 'Wet Rooms', 'Tiling', 'Suite Replacement', 'Plumbing'],
  'General Handyman': ['General Repairs', 'Assembly', 'Odd Jobs', 'Maintenance', 'Door Hanging', 'Minor Work'],
  'Other': ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5', 'Service 6']
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [tradeType, setTradeType] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    const data = {
      businessName,
      tradeType,
      services,
      location,
      phone,
      email
    }
    console.log('SAVING TO LOCALSTORAGE:', data)
    localStorage.setItem('nova_onboarding_data', JSON.stringify(data))
    router.push('/dashboard/website/templates')
  }

  const toggleService = (service: string) => {
    if (services.includes(service)) {
      setServices(services.filter(s => s !== service))
    } else if (services.length < 3) {
      setServices([...services, service])
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Setup Your Website</h1>
        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border rounded p-2 text-slate-900"
                placeholder="e.g. Smith Plumbing"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Trade Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TRADE_TYPES.map(trade => (
                  <button
                    key={trade}
                    onClick={() => setTradeType(trade)}
                    className={`p-2 border rounded ${tradeType === trade ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'}`}
                  >
                    {trade}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setStep(2)}
              disabled={!businessName || !tradeType}
              className="w-full bg-blue-600 text-white p-3 rounded disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Select up to 3 Services</label>
              <div className="grid grid-cols-1 gap-2">
                {(COMMON_SERVICES[tradeType] || []).map(service => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`p-3 border rounded text-left ${services.includes(service) ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'}`}
                  >
                    {service}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selected: {services.length}/3</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 border p-3 rounded text-slate-900"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={services.length === 0}
                className="flex-1 bg-blue-600 text-white p-3 rounded disabled:bg-gray-300"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded p-2 text-slate-900"
                placeholder="e.g. Manchester"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded p-2 text-slate-900"
                placeholder="07700 123456"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded p-2 text-slate-900"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="flex-1 border p-3 rounded text-slate-900"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!location || !phone || !email}
                className="flex-1 bg-blue-600 text-white p-3 rounded disabled:bg-gray-300"
              >
                Create My Website →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
