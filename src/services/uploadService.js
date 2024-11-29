// src/services/uploadService.js
import { supabase } from './supabaseClient';

export const uploadImage = async (file) => {
  try {
    // Ensure that the file is selected
    if (!file) {
      console.error('No file selected');
      return;
    }

    // Upload the file to the storage bucket
    const { data, error } = await supabase.storage
      .from('profile_pictures') // Name of the bucket
      .upload(file.name, file, {
        cacheControl: '3600', // Optional: Set cache control headers (1 hour cache)
        upsert: true, // Optional: Overwrite file if it already exists
      });

    if (error) {
      throw error;
    }

    // Return the public URL of the uploaded file
    const publicUrl = supabase.storage.from('profile_pictures').getPublicUrl(file.name)
      .data.publicUrl;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }
};
