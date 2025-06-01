import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

// --- Constants for Storage Keys ---
const STORAGE_KEYS = {
  USER: 'user',
  REMEMBER_ME: 'remember_me',
};

// --- Utility Functions for Local/Session Storage ---
const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

const getStorageItem = (key, rememberMe) => {
  const storage = getStorage(rememberMe);
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

const setStorageItem = (key, value, rememberMe) => {
  const storage = getStorage(rememberMe);
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

const removeStorageItem = (key, rememberMe) => {
  const storage = getStorage(rememberMe);
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
  }
};

// --- Helper to Extract Laravel Error Messages ---
const getLaravelErrorMessage = (error, defaultMessage) => {
  if (error.response?.data) {
    // Laravel validation errors (often nested under 'errors')
    if (error.response.data.errors) {
      // Flatten all validation messages into a single string
      return Object.values(error.response.data.errors)
        .flat()
        .filter(msg => typeof msg === 'string') // Ensure messages are strings
        .join(' ');
    }
    // General error message from Laravel (e.g., 'Unauthenticated.', 'CSRF token mismatch.')
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  // Fallback for network errors or unhandled API responses
  return error.message || defaultMessage;
};

// --- User Data Preparation ---
// Centralized function to prepare user data from Laravel's /api/user response
const prepareUserData = (laravelUser) => {
  if (!laravelUser) return null;
  return {
    id: laravelUser.id,
    name: laravelUser.name,
    email: laravelUser.email,
    roles: laravelUser.roles || [],
    phone: laravelUser.phone || null,
    address: laravelUser.address || null,
    birthdate: laravelUser.birthdate || null,
    gender: laravelUser.gender || null,
    profile_picture: laravelUser.profile_picture || null,
    is_active: laravelUser.is_active || true,
    last_login: laravelUser.last_login || null,
    created_at: laravelUser.created_at || null,
    updated_at: laravelUser.updated_at || null,
    // Add other relevant user fields as returned by Laravel's /api/user endpoint
    // e.g., role: laravelUser.role, profile_picture: laravelUser.profile_picture,
  };
};

// --- Authentication Thunks ---

/**
 * Thunk for user registration.
 * Handles API call for signup and stores user data on success.
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const { name, email, password, password_confirmation } = userData;

      // Laravel Breeze API stack registration endpoint is usually '/register'
      // Ensure this matches your Laravel routes (typically in web.php for SPAs)
      await apiClient.post('/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      // After successful registration, Laravel (with Breeze/Fortify) typically
      // logs the user in and establishes a session. Fetch user details.
      const userResponse = await apiClient.get('/user'); // Or '/api/user' if your route is prefixed
      const user = prepareUserData(userResponse.data);

      if (!user) {
        return rejectWithValue('User data not found after signup.');
      }

      // Default to remember on signup for convenience, or adjust based on UX
      const rememberMe = true;
      setStorageItem(STORAGE_KEYS.REMEMBER_ME, rememberMe);
      setStorageItem(STORAGE_KEYS.USER, user, rememberMe);

      return { user, isAuthenticated: true, rememberMe };
    } catch (error) {
      console.error('Signup API error:', error);
      return rejectWithValue(getLaravelErrorMessage(error, 'Signup failed. Please try again.'));
    }
  }
);

/**
 * Thunk for user login.
 * Handles API call for login and stores user data on success.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { email, password, rememberMe = false } = credentials;

      // Laravel Breeze API stack login endpoint is usually '/login'
      // Ensure this matches your Laravel routes (typically in web.php for SPAs)
      await apiClient.post('/login', {
        email,
        password,
        remember: rememberMe, // Laravel Fortify/Breeze expects 'remember' field
      });

      // Fetch authenticated user data from Laravel (after successful login)
      const userResponse = await apiClient.get('/api/user'); // Or '/api/user' if your route is prefixed
      const user = prepareUserData(userResponse.data);

      if (!user) {
        return rejectWithValue('User data not found after login.');
      }

      // Store user data based on 'rememberMe' preference
      setStorageItem(STORAGE_KEYS.REMEMBER_ME, rememberMe);
      // Clear the other storage type to avoid inconsistent state
      if (rememberMe) {
        removeStorageItem(STORAGE_KEYS.USER, false); // Clear sessionStorage if remembering
      } else {
        removeStorageItem(STORAGE_KEYS.USER, true); // Clear localStorage if not remembering
      }
      setStorageItem(STORAGE_KEYS.USER, user, rememberMe);

      return { user, isAuthenticated: true, rememberMe };
    } catch (error) {
      console.error('Login API error:', error);
      return rejectWithValue(getLaravelErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
  }
);

/**
 * Thunk to check current authentication status (e.g., on app load).
 * Attempts to fetch user data, implies authentication if successful.
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const userResponse = await apiClient.get('/user'); // Or '/api/user'
      const user = prepareUserData(userResponse.data);

      if (!user) {
        throw new Error('Not authenticated or user data missing.');
      }

      // Determine rememberMe based on stored preference
      const rememberMe = getStorageItem(STORAGE_KEYS.REMEMBER_ME, true) || false; // Check localStorage first
      setStorageItem(STORAGE_KEYS.USER, user, rememberMe); // Update storage if needed

      return { user, isAuthenticated: true, rememberMe };
    } catch (error) {
      console.warn('Authentication check failed (user likely not logged in or session expired):', error.message);
      // Clear all potentially stale auth data from both storage types
      removeStorageItem(STORAGE_KEYS.USER, true); // localStorage
      removeStorageItem(STORAGE_KEYS.USER, false); // sessionStorage
      removeStorageItem(STORAGE_KEYS.REMEMBER_ME); // localStorage
      return rejectWithValue('User not authenticated.');
    }
  }
);

/**
 * Thunk for user logout.
 * Handles API call for logout and dispatches client-side state reset.
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Laravel Breeze API stack logout endpoint is usually '/logout'
      await apiClient.post('/logout');
      console.log('API logout successful.');
      dispatch(authSlice.actions.logoutClient()); // Clear client state
      return true; // Indicate success
    } catch (error) {
      console.error('API logout error:', error);
      // Even if API logout fails, clear client state to prevent perceived login
      dispatch(authSlice.actions.logoutClient());
      return rejectWithValue(getLaravelErrorMessage(error, 'Logout failed.'));
    }
  }
);


// --- Initial State ---
const initialRememberMe = getStorageItem(STORAGE_KEYS.REMEMBER_ME, true) || false; // Check localStorage first
const initialUser = getStorageItem(STORAGE_KEYS.USER, initialRememberMe); // Load from preferred storage

const initialState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  rememberMe: initialRememberMe,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- Auth Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous action to clear client-side authentication state.
    // Can be dispatched directly or by thunks.
    logoutClient: (state) => {
      removeStorageItem(STORAGE_KEYS.USER, true); // From localStorage
      removeStorageItem(STORAGE_KEYS.USER, false); // From sessionStorage
      removeStorageItem(STORAGE_KEYS.REMEMBER_ME); // From localStorage
      state.user = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fulfilled state for checkAuth (similar to login/signup fulfilled, but might need distinct handling)
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
        state.error = null; // Ensure error is null if auth check succeeds
      })
      // Handle fulfilled state for logoutUser (state is already cleared by logoutClient dispatch)
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle'; // Set status, client state cleared by logoutClient
        state.error = null;
      })
      // Handle pending state for all auth thunks
      .addMatcher(
        isAnyOf(signup.pending, login.pending, checkAuth.pending, logoutUser.pending),
        (state) => {
          state.status = 'loading';
          state.error = null; // Clear previous errors on new request
        }
      )
      // Handle fulfilled state for login and signup
      .addMatcher(
        isAnyOf(login.fulfilled, signup.fulfilled),
        (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.rememberMe = action.payload.rememberMe;
        }
      )
      // Handle rejected state for all auth thunks
      .addMatcher(
        isAnyOf(signup.rejected, login.rejected, checkAuth.rejected, logoutUser.rejected),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || 'An unknown error occurred.';

          // For rejected login/signup/checkAuth, ensure user state is cleared
          if (isAnyOf(signup.rejected, login.rejected, checkAuth.rejected)(action)) {
            state.isAuthenticated = false;
            state.user = null;
            state.rememberMe = false; // Reset rememberMe preference too
          }
          // For logoutUser.rejected, client state is already cleared by logoutClient dispatch
        }
      );
  },
});

export const { clearError, logoutClient } = authSlice.actions;
export default authSlice.reducer;