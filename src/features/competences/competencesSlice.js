import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

// Thunks
export const fetchCompetences = createAsyncThunk(
  'competences/fetchCompetences',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get('/competences');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCompetence = createAsyncThunk(
  'competences/addCompetence',
  async (competenceData, { rejectWithValue }) => {
    try {
      return await apiService.post('/competences', competenceData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editCompetence = createAsyncThunk(
  'competences/editCompetence',
  async (competence, { rejectWithValue }) => {
    try {
      return await apiService.put(`/competences/${competence.id}`, competence);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCompetence = createAsyncThunk(
  'competences/deleteCompetence',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.delete(`/competences/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompetenceById = createAsyncThunk(
  'competences/fetchCompetenceById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiService.get(`/competences/${id}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  competences: [],
  selectedCompetence: null,
  loading: false,
  error: null,
};

const competencesSlice = createSlice({
  name: 'competences',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCompetence: (state) => {
      state.selectedCompetence = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch competences
      .addCase(fetchCompetences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetences.fulfilled, (state, action) => {
        state.loading = false;
        state.competences = action.payload;
      })
      .addCase(fetchCompetences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add competence
      .addCase(addCompetence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompetence.fulfilled, (state, action) => {
        state.loading = false;
        state.competences.push(action.payload);
      })
      .addCase(addCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit competence
      .addCase(editCompetence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCompetence.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competences.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.competences[index] = action.payload;
        }
      })
      .addCase(editCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete competence
      .addCase(deleteCompetence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompetence.fulfilled, (state, action) => {
        state.loading = false;
        state.competences = state.competences.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch competence by id
      .addCase(fetchCompetenceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetenceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompetence = action.payload;
      })
      .addCase(fetchCompetenceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCompetence } = competencesSlice.actions;
export default competencesSlice.reducer;
