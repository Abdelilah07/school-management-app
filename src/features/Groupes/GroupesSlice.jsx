import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';


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
export const fetchGroupes = createApiThunk('groups/fetchGroupes', () => apiService.get('/groups'));

export const addGroupe = createApiThunk('groups/addGroupe', (groupeData) => apiService.post('/groups', groupeData));

export const editGroupe = createApiThunk('groups/editGroupe', (group) =>
  apiService.put(`/groups/${group.id}`, group)
);

export const deleteGroupe = createApiThunk('groups/deleteGroupe', async (id) => {
  await apiService.delete(`/groups/${id}`);
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
  groups: [],
  loading: false,
  error: null,
  currentOperation: null,
};

const GroupesSlice = createSlice({
  name: 'groups',
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
    handleAsyncCases(builder, fetchGroupes, 'fetch', (state, action) => {
      state.groups = action.payload;
    });

    handleAsyncCases(builder, addGroupe, 'add', (state, action) => {
      state.groups.push(action.payload);
    });

    handleAsyncCases(builder, editGroupe, 'edit', (state, action) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    });

    handleAsyncCases(builder, deleteGroupe, 'delete', (state, action) => {
      state.groups = state.groups.filter((group) => group.id !== action.payload);
    });
  },
});

export const { clearError, setCurrentOperation } = GroupesSlice.actions;
export default GroupesSlice.reducer;



