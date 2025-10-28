import { supabase } from '../lib/supabase';

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket ('avatars', 'covers', or 'backgrounds')
 * @param userId - The user ID for organizing files
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'covers' | 'backgrounds',
  userId: string
): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);

      // Provide more helpful error messages
      if (error.message.includes('not found')) {
        throw new Error(`Storage bucket "${bucket}" does not exist. Please create it in Supabase Dashboard (Storage > New Bucket).`);
      }

      if (error.message.includes('row-level security') || error.message.includes('RLS') || error.message.includes('policy')) {
        throw new Error(`Permission denied: Please run the SQL policies in QUICK_FIX_STORAGE.sql file (in Supabase SQL Editor) to enable image uploads.`);
      }

      if (error.message.includes('JWT') || error.message.includes('authentication')) {
        throw new Error('Authentication error: Please log out and log back in, then try again.');
      }

      throw new Error(error.message || 'Failed to upload image. Check browser console for details.');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image
 * @param bucket - The storage bucket
 */
export async function deleteImage(
  url: string,
  bucket: 'avatars' | 'covers' | 'backgrounds'
): Promise<void> {
  try {
    // Extract the path from the URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): boolean {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
  }

  // Check file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  return true;
}
