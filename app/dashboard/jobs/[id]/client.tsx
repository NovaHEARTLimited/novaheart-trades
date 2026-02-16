"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import JobEditForm from './JobEditForm'
import StatusSelector from './StatusSelector'

interface Job {
  id: string
  title: string
  description: string | null
  status: string
  customer_id: string | null
  estimated_cost: number | null
  actual_cost: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  customers?: {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
  } | null
}

interface Customer {
  id: string
  name: string
  email: string | null
}

interface JobDetailClientProps {
  job: Job
  customers: Customer[]
  isEditing: boolean
}

export default function JobDetailClient({ job, customers, isEditing }: JobDetailClientProps) {
  const [showEditForm, setShowEditForm] = useState(isEditing)

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 font-medium">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/jobs" className="text-gray-900 hover:text-blue-600 font-medium">Jobs</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{job.title}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-700 font-medium mt-1">Job Details</p>
        </div>
        <div className="flex gap-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            job.status === 'completed' ? 'bg-green-100 text-green-800' :
            job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            job.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status.replace('_', ' ').toUpperCase()}
          </span>
          {!showEditForm && (
            <Button onClick={() => setShowEditForm(true)}>Edit Job</Button>
          )}
        </div>
      </div>

      {showEditForm ? (
        /* Edit Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Edit Job</CardTitle>
            <CardDescription className="text-gray-700 font-medium">Update job information</CardDescription>
          </CardHeader>
          <CardContent>
            <JobEditForm
              job={job}
              customers={customers}
              onCancel={() => setShowEditForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-semibold">Description</Label>
                <p className="text-gray-900 font-medium mt-1">
                  {job.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-semibold">Estimated Cost</Label>
                  <p className="text-gray-900 font-medium">
                    {job.estimated_cost ? `£${job.estimated_cost.toFixed(2)}` : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 font-semibold">Actual Cost</Label>
                  <p className="text-gray-900 font-medium">
                    {job.actual_cost ? `£${job.actual_cost.toFixed(2)}` : 'Not set'}
                  </p>
                </div>
              </div>

              {job.start_date && (
                <div>
                  <Label className="text-gray-700 font-semibold">Scheduled Date</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(job.start_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {job.end_date && (
                <div>
                  <Label className="text-gray-700 font-semibold">Completed Date</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(job.end_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-semibold">Created</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 font-semibold">Last Updated</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(job.updated_at).toLocaleDateString()}
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
              {job.customers ? (
                <>
                  <div>
                    <Label className="text-gray-700 font-semibold">Name</Label>
                    <p className="text-gray-900 font-medium">{job.customers.name}</p>
                  </div>

                  {job.customers.email && (
                    <div>
                      <Label className="text-gray-700 font-semibold">Email</Label>
                      <p className="text-gray-900 font-medium">{job.customers.email}</p>
                    </div>
                  )}

                  {job.customers.phone && (
                    <div>
                      <Label className="text-gray-700 font-semibold">Phone</Label>
                      <p className="text-gray-900 font-medium">{job.customers.phone}</p>
                    </div>
                  )}

                  {job.customers.address && (
                    <div>
                      <Label className="text-gray-700 font-semibold">Address</Label>
                      <p className="text-gray-900 font-medium">{job.customers.address}</p>
                    </div>
                  )}

                  <Link href={`/dashboard/customers/${job.customers.id}`}>
                    <Button variant="outline" className="mt-4">View Customer Details</Button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 font-medium">No customer assigned</p>
                  <Button className="mt-4" onClick={() => setShowEditForm(true)}>Assign Customer</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold">Status Management</CardTitle>
          <CardDescription className="text-gray-700 font-medium">Update job status</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusSelector jobId={job.id} currentStatus={job.status} />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="outline" className="text-gray-700">← Back to Jobs</Button>
        </Link>
      </div>
    </div>
  )
}