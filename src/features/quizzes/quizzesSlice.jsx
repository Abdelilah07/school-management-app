import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  quizzes: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Create an async thunk to fetch quizzes
export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async () => {
  const response = await fetch('http://localhost:3000/quizzes');
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
});

// Create the quizzes slice
const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the reducer to be added to the store
export default quizzesSlice.reducer;
