import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks for fetching data
export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
  const response = await axios.get("http://localhost:5001/courses");
  return response.data;
});

// Course slice
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    status: "idle", 
    error: null,
  },
  reducers: {
    markAsCompleted: (state, action) => {
      const courseId = action.payload;
      const course = state.courses.find((course) => course.id === courseId);
      if (course) {
        course.status = "completed"; // Change the status to "completed"
      }
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { markAsCompleted, setCourses } = courseSlice.actions;

// Export the reducer to configure the store
export default courseSlice.reducer;

