// src/services/profileService.js
import apiClient from "../api/axios";

// --- Profile Operations for the Authenticated User ---

/**
 * Fetches the currently authenticated user's profile details.
 * Requires an authentication token/session to be present.
 * This is crucial for initially populating the profile page.
 *
 * @returns {Promise<Object>} The authenticated user's profile data.
 */
export const getMyProfile = async () => {
  try {
    const response = await apiClient.get('/api/user'); // Laravel's default endpoint for authenticated user
    return response.data; // Assuming Laravel returns user data directly
  } catch (error) {
    console.error('Error fetching my profile:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch your profile.');
  }
};

/**
 * Updates the authenticated user's profile details.
 *
 * @param {Object} updatedData - The data to update for the profile.
 * Ensure field names match Laravel's expected columns (e.g., 'phone', 'birthdate', 'profile_picture').
 * @returns {Promise<Object>} The updated user profile data.
 */
export const updateMyProfile = async (updatedData) => {
  try {
    // Assuming the authenticated user's profile update uses a route like /user or /users/{id}
    // and the backend identifies the user from the authentication token/session.
    // If your backend expects a userId in the URL for the authenticated user's update,
    // you would need to pass it here (e.g., `/users/${userId}`).
    // For common profile updates, the /user endpoint is often sufficient when authenticated.
    const response = await apiClient.put('/api/user', updatedData); // Or PATCH if your API uses PATCH for partial updates
    return response.data.user || response.data; // Adjust based on your Laravel API response structure
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to update profile.';
     if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`${errorMessage}\n${validationErrors.join('\n')}`);
    }
    throw new Error(errorMessage);
  }
};

/**
 * Changes the password for the currently authenticated user.
 *
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {string} newPasswordConfirmation
 * @returns {Promise<Object>} A success message.
 */
export const changeMyPassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
  try {
    const response = await apiClient.put('/api/user/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    });
    return response.data; // Assuming Laravel returns a success message
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to change password.';
    if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`${errorMessage}\n${validationErrors.join('\n')}`);
    }
    throw new Error(errorMessage);
  }
};

// --- Note on other services ---
// Functions like login, register, logout would typically be in an 'authService.js'.
// Functions for managing all users (e.g., for an admin panel) like 'getAllUsers', 'deleteUser', 'getUserById'
// would typically be in an 'adminUserService.js' or 'userManagementService.js'.
// File upload specifically (e.g., profile picture) should remain in 'uploadService.js'.