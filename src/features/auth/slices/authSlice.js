// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config, { apiService } from '../../../api/config';

// Constants
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LOGIN_ATTEMPTS: 'login_attempts',
};

const validatePassword = (password) => {
  const errors = [];
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

const isLockedOut = (email) => {
  const attempts = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`)) || {
    count: 0,
    timestamp: null,
  };
  if (attempts.count >= 5) {
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes
    const timePassed = Date.now() - attempts.timestamp;
    if (timePassed < lockoutDuration) {
      return true;
    }
    localStorage.removeItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`);
  }
  return false;
};

const recordLoginAttempt = (email) => {
  const attempts = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`)) || {
    count: 0,
    timestamp: null,
  };
  attempts.count += 1;
  attempts.timestamp = Date.now();
  localStorage.setItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`, JSON.stringify(attempts));
};

// Thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (isLockedOut(credentials.email)) {
      throw new Error('Account temporarily locked. Please try again later.');
    }

    // Get user data from json-server
    const users = await apiService.get(`/users?email=${credentials.email}`);
    const user = users[0];

    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== credentials.password) {
      recordLoginAttempt(credentials.email);
      throw new Error('Invalid password');
    }

    // Generate tokens (in real app these would come from the server)
    const token = 'dummy-token-' + Date.now();
    const refreshToken = 'dummy-refresh-token-' + Date.now();

    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.TOKEN, token);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    storage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const passwordErrors = validatePassword(userData.password);
    if (passwordErrors.length > 0) {
      throw new Error(passwordErrors.join('. '));
    }

    // Check if user exists
    const existingUsers = await apiService.get(`/users?email=${userData.email}`);
    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const response = await apiService.post('/users', newUser);

    // Generate tokens
    const token = 'dummy-token-' + Date.now();
    const refreshToken = 'dummy-refresh-token-' + Date.now();

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response));

    return {
      token,
      refreshToken,
      user: response,
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

// Initial state
const initialState = {
  user: JSON.parse(
    localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER) || 'null'
  ),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN),
  isAuthenticated: !!(
    localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
  ),
  status: 'idle',
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      return {
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
