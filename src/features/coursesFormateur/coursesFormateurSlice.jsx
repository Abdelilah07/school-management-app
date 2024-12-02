import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000/courses';

// Fetch courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const response = await fetch(API_URL);
  return response.json();
});

// Add a new course
export const addCourse = createAsyncThunk('courses/addCourse', async (newCourse) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCourse),
  });
  return response.json();
});

// Delete a course
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId) => {
  await fetch(`${API_URL}/${courseId}`, { method: 'DELETE' });
  return courseId;
});

// Update a course
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, updatedCourse }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCourse),
  });
  return response.json();
});

// Initial state
const initialState = {
  courses: [],
  status: 'idle',
  error: null,
};

// Slice
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add a course
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })

      // Delete a course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course.id !== action.payload);
      })

      // Update a course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((course) => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      });
  },
});

export default courseSlice.reducer;
