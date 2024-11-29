import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../services/supabaseClient';

// Constants
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  REMEMBER_ME: 'remember_me',
};

// Utility Functions
const validatePassword = (password) => {
  const errors = [];
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
    return errors;
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return errors;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Email is required and must be a string';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

const getStorageItem = (key, storage = localStorage) => {
  try {
    return JSON.parse(storage.getItem(key));
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

const setStorageItem = (key, value, storage = localStorage) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

// Authentication Thunks
export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { email, password, name, role, profile_picture } = userData;

    // Validate email and password
    const emailError = validateEmail(email);
    if (emailError) {
      throw new Error(emailError);
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      throw new Error(passwordErrors.join('. '));
    }

    // Check if user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (checkError) {
      throw checkError;
    }

    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }

    // Create new user in Supabase users table
    const { data: newUserResponse, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password,
        name,
        role,
        created_at: new Date().toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Prepare user data for storage
    const userDataToStore = {
      id: newUserResponse.id,
      name: newUserResponse.name,
      email: newUserResponse.email,
      role: newUserResponse.role,
    };

    // Store in localStorage (default for signup)
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    setStorageItem(STORAGE_KEYS.USER, userDataToStore);
    setStorageItem(STORAGE_KEYS.TOKEN, `dummy-token-${Date.now()}`);

    return {
      user: userDataToStore,
      token: `dummy-token-${Date.now()}`,
      rememberMe: true,
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { email, password, rememberMe = false } = credentials;
    const emailError = validateEmail(email);

    if (emailError) {
      throw new Error(emailError);
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Fetch user from Supabase users table
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('email', email)
      .limit(1);

    if (fetchError) {
      throw fetchError;
    }

    const user = users[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Choose storage based on remember me
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store remember me preference
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(rememberMe));

    // Clear inconsistent storage
    if (!rememberMe) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }

    // Prepare user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roles.name,
      profile_picture: user.profile_picture,
      status: user.status,
      created_at: user.created_at,
      last_login: user.last_login,
      phone_number: user.phone_number,
      bio: user.bio,
      website: user.website,
      address: user.address,
    };

    // Generate token (dummy in this example)
    const token = `dummy-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Store tokens and user data
    setStorageItem(STORAGE_KEYS.TOKEN, token, storage);
    setStorageItem(STORAGE_KEYS.USER, userData, storage);

    return {
      token,
      user: userData,
      rememberMe,
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

// Determine initial authentication state
const getInitialAuthState = () => {
  const rememberMe = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) || 'false');

  // If remember me is true, check localStorage, else check sessionStorage
  const storage = rememberMe ? localStorage : sessionStorage;

  const user = getStorageItem(STORAGE_KEYS.USER, storage);
  const token = storage.getItem(STORAGE_KEYS.TOKEN);

  return {
    user,
    token,
    isAuthenticated: !!token,
    rememberMe,
  };
};

// Initial state
const initialState = {
  ...getInitialAuthState(),
  status: 'idle',
  error: null,
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      try {
        // Remove from both local and session storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
      } catch (error) {
        console.error('Error during logout:', error);
      }

      return {
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
        rememberMe: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
