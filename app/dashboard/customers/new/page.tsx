import { createCustomer } from '@/actions/customers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
        <p className="text-gray-600">Create a new customer record</p>
      </div>

      <form className="space-y-4" action={createCustomer}>
        <div>
          <Label htmlFor="name">Customer Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Enter customer name"
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            placeholder="Enter address"
            rows={3}
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Additional notes about the customer"
            rows={3}
            className="bg-white text-black border-gray-300"
          />
        </div>

        {params?.message && (
          <div className="text-red-600 text-sm">
            {params.message}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Create Customer</Button>
          <Link href="/dashboard">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}