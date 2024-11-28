
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const initialState = {
  trainees: [],
  status: 'idle',
  error: null,
  filiereFilter: null,
  groupeFilter: null,
};

export const fetchTrainees = createAsyncThunk(
  'trainees/fetchTrainees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/trainees`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTraineeAPI = createAsyncThunk(
  'trainees/addTraineeAPI',
  async (trainee, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/trainees`, trainee);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTraineeAPI = createAsyncThunk(
  'trainees/updateTraineeAPI',
  async (trainee, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/trainees/${trainee.id}`, trainee);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTraineeAPI = createAsyncThunk(
  'trainees/deleteTraineeAPI',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/trainees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const traineesSlice = createSlice({
  name: 'trainees',
  initialState,
  reducers: {
    setFiliereFilter(state, action) {
      state.filiereFilter = action.payload;
    },
    setGroupeFilter(state, action) {
      state.groupeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainees = action.payload;
      })
      .addCase(fetchTrainees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addTraineeAPI.fulfilled, (state, action) => {
        state.trainees.push(action.payload);
      })
      .addCase(addTraineeAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTraineeAPI.fulfilled, (state, action) => {
        const index = state.trainees.findIndex(
          (trainee) => trainee.id === action.payload.id
        );
        if (index !== -1) {
          state.trainees[index] = action.payload;
        }
      })
      .addCase(updateTraineeAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTraineeAPI.fulfilled, (state, action) => {
        state.trainees = state.trainees.filter(
          (trainee) => trainee.id !== action.payload
        );
      })
      .addCase(deleteTraineeAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFiliereFilter, setGroupeFilter } = traineesSlice.actions;

export const selectTrainees = (state) => state.trainees.trainees;
export const selectStatus = (state) => state.trainees.status;
export const selectError = (state) => state.trainees.error;

export default traineesSlice.reducer;
