import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config.js';
import config from '../../api/config.js';

const STAGIAIRES_ENDPOINT = config.api.endpoints.stagiaires;

const initialState = {
  stagiaires: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filiereFilter: null, // Added to match the reducers
  groupeFilter: null, // Added to match the reducers
};

// Async thunks using apiService
export const fetchStagiaires = createAsyncThunk('stagiaires/fetchStagiaires', async () => {
  return await apiService.get(STAGIAIRES_ENDPOINT);
});

export const addStagiaireAPI = createAsyncThunk('stagiaires/addStagiaireAPI', async (stagiaire) => {
  return await apiService.post(STAGIAIRES_ENDPOINT, stagiaire);
});

export const deleteStagiaireAPI = createAsyncThunk('stagiaires/deleteStagiaireAPI', async (cef) => {
  await apiService.delete(`${STAGIAIRES_ENDPOINT}/${cef}`);
  return cef;
});

export const updateStagiaireAPI = createAsyncThunk(
  'stagiaires/updateStagiaireAPI',
  async (stagiaire) => {
    return await apiService.put(`${STAGIAIRES_ENDPOINT}/${stagiaire.cef}`, stagiaire);
  }
);

const stagiaireSlice = createSlice({
  name: 'stagiaires',
  initialState,
  reducers: {
    addStagiaire: (state, action) => {
      state.stagiaires.push(action.payload);
    },
    deleteStagiaire: (state, action) => {
      state.stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.cef !== action.payload);
    },
    setFiliereFilter: (state, action) => {
      state.filiereFilter = action.payload;
    },
    setGroupeFilter: (state, action) => {
      state.groupeFilter = action.payload;
    },
    updateStagiaire: (state, action) => {
      const index = state.stagiaires.findIndex((stagiaire) => stagiaire.cef === action.payload.cef);
      if (index !== -1) {
        state.stagiaires[index] = action.payload;
      }
    },
    // Added to handle error reset
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stagiaires
      .addCase(fetchStagiaires.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStagiaires.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stagiaires = action.payload;
        state.error = null;
      })
      .addCase(fetchStagiaires.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add stagiaire
      .addCase(addStagiaireAPI.pending, (state) => {
        state.error = null;
      })
      .addCase(addStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires.push(action.payload);
        state.error = null;
      })
      .addCase(addStagiaireAPI.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete stagiaire
      .addCase(deleteStagiaireAPI.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.cef !== action.payload);
        state.error = null;
      })
      .addCase(deleteStagiaireAPI.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update stagiaire
      .addCase(updateStagiaireAPI.pending, (state) => {
        state.error = null;
      })
      .addCase(updateStagiaireAPI.fulfilled, (state, action) => {
        const index = state.stagiaires.findIndex(
          (stagiaire) => stagiaire.cef === action.payload.cef
        );
        if (index !== -1) {
          state.stagiaires[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStagiaireAPI.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  addStagiaire,
  deleteStagiaire,
  setFiliereFilter,
  setGroupeFilter,
  updateStagiaire,
  clearError,
} = stagiaireSlice.actions;

// Selectors
export const selectStagiaires = (state) => state.stagiaires.stagiaires;
export const selectFiliereFilter = (state) => state.stagiaires.filiereFilter;
export const selectGroupeFilter = (state) => state.stagiaires.groupeFilter;
export const selectStatus = (state) => state.stagiaires.status;
export const selectError = (state) => state.stagiaires.error;

export default stagiaireSlice.reducer;
