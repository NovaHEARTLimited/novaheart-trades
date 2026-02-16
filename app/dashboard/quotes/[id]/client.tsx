"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import QuoteEditForm from './QuoteEditForm'
import StatusSelector from './StatusSelector'

interface Quote {
  id: string
  job_id: string
  total_amount: number
  status: string
  valid_until: string | null
  notes: string | null
  created_at: string
  updated_at: string
  jobs: {
    id: string
    title: string
    customers: {
      id: string
      name: string
      email: string | null
      phone: string | null
    } | null
  } | null
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

interface QuoteDetailClientProps {
  quote: Quote
  lineItems: LineItem[]
  isEditing: boolean
}

export default function QuoteDetailClient({ quote, lineItems, isEditing }: QuoteDetailClientProps) {
  const [showEditForm, setShowEditForm] = useState(isEditing)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const quoteNumber = `Q-${new Date(quote.created_at).getFullYear()}-${quote.id.slice(-3).toUpperCase()}`

  // Calculate totals from line items if available, otherwise use stored total
  const subtotal = lineItems.reduce((sum, item) => sum + item.total_price, 0)
  const taxRate = 20 // Default UK VAT
  const taxAmount = (subtotal * taxRate) / 100
  const grandTotal = subtotal + taxAmount

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 font-medium">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/quotes" className="text-gray-900 hover:text-blue-600 font-medium">Quotes</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{quoteNumber}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quoteNumber}</h1>
          <p className="text-gray-700 font-medium mt-1">Quote Details</p>
        </div>
        <div className="flex gap-3">
          <Badge className={`${getStatusColor(quote.status)} border-0 px-3 py-1`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
          {!showEditForm && (
            <Button onClick={() => setShowEditForm(true)}>Edit Quote</Button>
          )}
        </div>
      </div>

      {showEditForm ? (
        /* Edit Form */
        <QuoteEditForm
          quote={quote}
          lineItems={lineItems}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Quote Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-semibold">Job</Label>
                <p className="text-gray-900 font-medium mt-1">
                  {quote.jobs?.title || 'No job specified'}
                </p>
              </div>

              <div>
                <Label className="text-gray-700 font-semibold">Customer</Label>
                <p className="text-gray-900 font-medium mt-1">
                  {quote.jobs?.customers?.name || 'No customer'}
                </p>
              </div>

              {quote.valid_until && (
                <div>
                  <Label className="text-gray-700 font-semibold">Valid Until</Label>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(quote.valid_until).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {quote.notes && (
                <div>
                  <Label className="text-gray-700 font-semibold">Notes</Label>
                  <p className="text-gray-900 font-medium mt-1 whitespace-pre-line">
                    {quote.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <Label className="text-gray-700 font-semibold">Created</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 font-semibold">Last Updated</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(quote.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quote.jobs?.customers ? (
                <>
                  <div>
                    <Label className="text-gray-700 font-semibold">Name</Label>
                    <p className="text-gray-900 font-medium">{quote.jobs.customers.name}</p>
                  </div>

                  {quote.jobs.customers.email && (
                    <div>
                      <Label className="text-gray-700 font-semibold">Email</Label>
                      <p className="text-gray-900 font-medium">
                        <a
                          href={`mailto:${quote.jobs.customers.email}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {quote.jobs.customers.email}
                        </a>
                      </p>
                    </div>
                  )}

                  {quote.jobs.customers.phone && (
                    <div>
                      <Label className="text-gray-700 font-semibold">Phone</Label>
                      <p className="text-gray-900 font-medium">
                        <a
                          href={`tel:${quote.jobs.customers.phone}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {quote.jobs.customers.phone}
                        </a>
                      </p>
                    </div>
                  )}

                  <Link href={`/dashboard/customers/${quote.jobs.customers.id}`}>
                    <Button variant="outline" className="mt-4">View Customer Details</Button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 font-medium">No customer information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Line Items */}
      {lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-right text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900">£{item.unit_price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">£{item.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold">Quote Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-700 font-semibold">Subtotal:</span>
              <span className="text-gray-900 font-medium">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-semibold">Tax (20%):</span>
              <span className="text-gray-900 font-medium">£{taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">£{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold">Status Management</CardTitle>
          <CardDescription className="text-gray-700 font-medium">Update quote status</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusSelector quoteId={quote.id} currentStatus={quote.status} />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Link href="/dashboard/quotes">
          <Button variant="outline" className="text-gray-700">← Back to Quotes</Button>
        </Link>
      </div>
    </div>
  )
}