import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Récupérer toutes les compétences
export const fetchCompetences = createAsyncThunk('competences/fetchCompetences', async () => {
  const response = await axios.get('http://localhost:3020/compétences');
  return response.data;
});

// Ajouter une compétence
export const addCompetence = createAsyncThunk('competences/addCompetence', async (competenceData) => {
  const response = await axios.post('http://localhost:3020/compétences', competenceData);
  return competenceData;
});

// Modifier une compétence
export const editCompetence = createAsyncThunk('competences/editCompetence', async (competence) => {
  const response = await axios.put(`http://localhost:3020/compétences/${competence.id}`, competence);
  return competence;
});

// Supprimer une compétence
export const deleteCompetence = createAsyncThunk('competences/deleteCompetence', async (id) => {
  await axios.delete(`http://localhost:3020/compétences/${id}`);
  return id;
});

// Récupérer une compétence par son ID
export const fetchCompetenceById = createAsyncThunk('competences/fetchCompetenceById', async (id) => {
  const response = await axios.get(`http://localhost:3020/compétences/${id}`);
  return response.data;
});

const competencesSlice = createSlice({
  name: 'competences',
  initialState: {
    competences: [],
    selectedCompetence: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Récupérer les compétences
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
        state.error = action.error.message;
      })

      // Ajouter une compétence
      .addCase(addCompetence.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCompetence.fulfilled, (state, action) => {
        state.loading = false;
        state.competences.push(action.payload); // Add the new competence to the list
      })
      .addCase(addCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Modifier une compétence
      .addCase(editCompetence.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCompetence.fulfilled, (state, action) => {
        state.loading = false;
        state.competences = state.competences.map((competence) =>
          competence.id === action.payload.id ? action.payload : competence
        ); // Using map for better readability
      })
      .addCase(editCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Supprimer une compétence
      .addCase(deleteCompetence.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompetence.fulfilled, (state, action) => {
        state.loading = false;
        state.competences = state.competences.filter((competence) => competence.id !== action.payload);
      })
      .addCase(deleteCompetence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Récupérer une compétence par ID
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
        state.error = action.error.message;
      });
  },
});

export default competencesSlice.reducer;
