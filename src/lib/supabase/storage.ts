/**
 * Storage helpers for uploading/retrieving files from Supabase Storage.
 * Browser-side functions use the client, server-side use the server client.
 */
import { createClient } from '@/lib/supabase/client'

type Bucket = 'avatars' | 'plan-thumbnails' | 'transformations' | 'plan-documents'

/** Get the public URL for a storage object */
export function getPublicUrl(bucket: Bucket, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload a user's avatar.
 * Path: avatars/{userId}/avatar.{ext}
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error?: string }> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) return { url: null, error: error.message }

  return { url: getPublicUrl('avatars', path) }
}

/**
 * Upload a plan thumbnail (trainer/admin only).
 * Path: plan-thumbnails/{planId}/thumbnail.{ext}
 */
export async function uploadPlanThumbnail(
  planId: string,
  file: File
): Promise<{ url: string | null; error?: string }> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${planId}/thumbnail.${ext}`

  const { error } = await supabase.storage
    .from('plan-thumbnails')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) return { url: null, error: error.message }

  return { url: getPublicUrl('plan-thumbnails', path) }
}

/**
 * Create a signed URL for a plan document (private bucket).
 * Only resolves if RLS allows the current user to access it.
 * URL expires in 1 hour.
 */
export async function getPlanDocumentSignedUrl(
  planId: string,
  filename: string
): Promise<string | null> {
  const supabase = createClient()
  const path = `${planId}/${filename}`

  const { data, error } = await supabase.storage
    .from('plan-documents')
    .createSignedUrl(path, 3600) // 1 hour expiry

  if (error) {
    console.error('[getPlanDocumentSignedUrl]', error.message)
    return null
  }

  return data.signedUrl
}

/** Get file size in human-readable format */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
