import { createClient } from '@/lib/supabase/server'

export async function uploadSiteAsset(path: string, file: File) {
  const supabase = await createClient()

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(path, file, {
      upsert: true,
      contentType: file.type || 'application/octet-stream',
    })

  if (error) throw error

  const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
  return data.publicUrl
}