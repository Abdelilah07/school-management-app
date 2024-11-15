import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3003/groups';


export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});


export const deleteGroupAPI = createAsyncThunk('groups/deleteGroup',async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.status === 200) {
        console.log(`Groupe avec ID ${id} supprimé avec succès`);
        return id;
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la requête DELETE:', error);
      return rejectWithValue(error.message);
    }
  }
);


export const addGroupAPI = createAsyncThunk('groups/addGroup',async (newGroup, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newGroup);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du groupe:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateGroupAPI = createAsyncThunk('groups/updateGroup', async (updatedGroup) => {
  const response = await axios.put(`${API_URL}/${updatedGroup.id}`, updatedGroup); 
  console.log(updatedGroup)
  if (!response.status === 200) { 
    throw new Error('Failed to update group');
  }
  return response.data; 
});

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteGroupAPI.pending, (state) => {
        state.loading = true;
      })
      builder.addCase(deleteGroupAPI.fulfilled, (state, action) => {
        const id = action.payload;
        state.groups = state.groups.filter(group => group.id !== id);
      
      })
      .addCase(deleteGroupAPI.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addGroupAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGroupAPI.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(addGroupAPI.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateGroupAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroupAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateGroupAPI.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default groupsSlice.reducer;
