// src/services/userService.js
import { supabase } from './supabaseClient';

// Update user
export const updateUser = async (userId, updatedData) => {
  const { data, error } = await supabase
    .from('users')
    .update(updatedData)
    .eq('id', userId)
    .select('*');

  if (error) {
    throw new Error('Error updating user: ' + error.message);
  }
  return data?.[0]; // Return the updated user object
};

// Delete user
export const deleteUser = async (userId) => {
  const { data, error } = await supabase.from('users').delete().eq('id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    return null;
  }
  return data;
};
