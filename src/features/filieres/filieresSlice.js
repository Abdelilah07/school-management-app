import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

// Helper for async thunks
const createApiThunk = (typePrefix, apiCall) => {
  return createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
    try {
      return await apiCall(args);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
};

// Thunks
export const fetchFilieres = createApiThunk('filieres/fetchFilieres', () => apiService.get('/filieres'));

export const addFiliere = createApiThunk('filieres/addFiliere', (filiereData) => apiService.post('/filieres', filiereData));

export const editFiliere = createApiThunk('filieres/editFiliere', (filiere) =>
  apiService.put(`/filieres/${filiere.id}`, filiere)
);

export const deleteFiliere = createApiThunk('filieres/deleteFiliere', async (id) => {
  await apiService.delete(`/filieres/${id}`);
  return id;
});

// Helper for handling cases
const handleAsyncCases = (builder, thunk, operation, onSuccess) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentOperation = operation;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      onSuccess(state, action);
      state.currentOperation = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentOperation = null;
    });
};

const initialState = {
  filieres: [],
  loading: false,
  error: null,
  currentOperation: null,
};

const filieresSlice = createSlice({
  name: 'filieres',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOperation: (state, action) => {
      state.currentOperation = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchFilieres, 'fetch', (state, action) => {
      state.filieres = action.payload;
    });

    handleAsyncCases(builder, addFiliere, 'add', (state, action) => {
      state.filieres.push(action.payload);
    });

    handleAsyncCases(builder, editFiliere, 'edit', (state, action) => {
      const index = state.filieres.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.filieres[index] = action.payload;
      }
    });

    handleAsyncCases(builder, deleteFiliere, 'delete', (state, action) => {
      state.filieres = state.filieres.filter((filiere) => filiere.id !== action.payload);
    });
  },
});

export const { clearError, setCurrentOperation } = filieresSlice.actions;
export default filieresSlice.reducer;