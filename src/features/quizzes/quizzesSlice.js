// quizzesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

const initialState = {
  quizzes: [],
  status: 'idle',
  error: null,
};

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get('/quizzes');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = quizzesSlice.actions;
export default quizzesSlice.reducer;
