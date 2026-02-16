"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import CustomerEditForm from './CustomerEditForm'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Job {
  id: string
  title: string
  status: string
  estimated_cost: number | null
  created_at: string
}

interface CustomerDetailClientProps {
  customer: Customer
  jobs: Job[]
  jobCount: number
  isEditing: boolean
}

export default function CustomerDetailClient({ customer, jobs, jobCount, isEditing }: CustomerDetailClientProps) {
  const [showEditForm, setShowEditForm] = useState(isEditing)

  const formatAddress = (address: string | null) => {
    if (!address) return null
    return address.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < address.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 font-medium">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/customers" className="text-gray-900 hover:text-blue-600 font-medium">Customers</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{customer.name}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-700 font-medium mt-1">Customer Details</p>
        </div>
        <div className="flex gap-3">
          <span className="text-sm text-gray-700 font-medium">
            {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
          </span>
          {!showEditForm && (
            <Button onClick={() => setShowEditForm(true)}>Edit Customer</Button>
          )}
        </div>
      </div>

      {showEditForm ? (
        /* Edit Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Edit Customer</CardTitle>
            <CardDescription className="text-gray-700 font-medium">Update customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerEditForm
              customer={customer}
              onCancel={() => setShowEditForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-semibold">Name</Label>
                <p className="text-gray-900 font-medium mt-1">{customer.name}</p>
              </div>

              {customer.email && (
                <div>
                  <Label className="text-gray-700 font-semibold">Email</Label>
                  <p className="text-gray-900 font-medium mt-1">
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {customer.email}
                    </a>
                  </p>
                </div>
              )}

              {customer.phone && (
                <div>
                  <Label className="text-gray-700 font-semibold">Phone</Label>
                  <p className="text-gray-900 font-medium mt-1">
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {customer.phone}
                    </a>
                  </p>
                </div>
              )}

              {customer.address && (
                <div>
                  <Label className="text-gray-700 font-semibold">Address</Label>
                  <p className="text-gray-900 font-medium mt-1">
                    {formatAddress(customer.address)}
                  </p>
                </div>
              )}

              {customer.notes && (
                <div>
                  <Label className="text-gray-700 font-semibold">Notes</Label>
                  <p className="text-gray-900 font-medium mt-1 whitespace-pre-line">
                    {customer.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <Label className="text-gray-700 font-semibold">Created</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 font-semibold">Last Updated</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(customer.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{jobCount}</div>
                <div className="text-gray-700 font-medium">Total Jobs</div>
              </div>

              {jobCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-700 font-semibold">Recent Jobs</Label>
                  <div className="space-y-2 mt-2">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="text-gray-900 font-medium hover:text-blue-600 flex-1 truncate"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge
                            variant="secondary"
                            className={`${
                              job.status === 'completed' ? 'bg-green-100 text-green-800' :
                              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {job.status.replace('_', ' ')}
                          </Badge>
                          {job.estimated_cost && (
                            <span className="text-sm text-gray-700 font-medium">
                              £{job.estimated_cost.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {jobCount > 5 && (
                    <p className="text-sm text-gray-700 font-medium mt-2">
                      And {jobCount - 5} more jobs...
                    </p>
                  )}
                </div>
              )}

              {jobCount === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-700 font-medium">No jobs yet</p>
                  <Link href={`/dashboard/jobs/new?customer=${customer.id}`}>
                    <Button className="mt-4">Create First Job</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" className="text-gray-700">← Back to Customers</Button>
        </Link>
      </div>
    </div>
  )
}