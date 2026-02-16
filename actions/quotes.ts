'use server'

import { revalidatePath } from 'next/cache'

/**
 * Flexible stubs to satisfy TypeScript while you restore real implementations.
 * These accept either:
 *  - a single object (formData) which may include an id field, or
 *  - two args (id, data).
 */

function resolveIdAndData(arg1: unknown, arg2?: unknown) {
  if (arg2 !== undefined) {
    return { id: arg1, data: arg2 ?? {} }
  }
  // single-arg form: treat arg1 as data object that may include id
  const data = (arg1 ?? {}) as any
  const id = data?.id ?? ''
  return { id, data }
}

export async function updateQuote(arg1: unknown, arg2?: unknown) {
  const { id, data } = resolveIdAndData(arg1, arg2)
  // TODO: implement real update logic
  revalidatePath('/dashboard/quotes')
  return { id, ...data }
}

export async function updateQuoteStatus(arg1: unknown, arg2?: unknown) {
  const { id, data } = resolveIdAndData(arg1, arg2)
  const status = (arg2 !== undefined) ? arg2 : data?.status
  // TODO: implement real status update logic
  revalidatePath('/dashboard/quotes')
  return { id, status }
}

export async function createQuote(data: Partial<Record<string, unknown>>) {
  // TODO: implement real create logic
  revalidatePath('/dashboard/quotes')
  return { id: 'new-id', ...data }
}
