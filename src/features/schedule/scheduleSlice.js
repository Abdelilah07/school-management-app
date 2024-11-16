import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

export const SCHEDULE_CONSTANTS = {
  levels: ['1ere annee', '2eme annee'],
  classes: ['DEV', 'ID'],
  timeSlots: ['8:30 AM - 11:00 AM', '11:00 AM - 1:15 PM', '1:30 PM - 4:00 PM', '4:00 PM - 6:30 PM'],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const initialSchedule = SCHEDULE_CONSTANTS.days.reduce((acc, day) => {
  acc[day] = Array(SCHEDULE_CONSTANTS.timeSlots.length).fill('empty');
  return acc;
}, {});

const initialState = {
  scheduleData: initialSchedule,
  selectedLevel: '',
  selectedClass: '',
  loading: false,
  error: null,
};

export const fetchSchedule = createAsyncThunk(
  'schedule/fetchSchedule',
  async ({ selectedClass, selectedLevel }, { rejectWithValue }) => {
    try {
      if (!selectedClass || !selectedLevel) {
        return initialSchedule;
      }
      const data = await apiService.get('/emploi');
      if (data && data[selectedClass] && data[selectedClass][selectedLevel]) {
        return data[selectedClass][selectedLevel];
      }
      throw new Error('Schedule not found');
    } catch (error) {
      return rejectWithValue('Failed to fetch schedule. Please try again later.');
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSchedule: (state) => {
      state.scheduleData = initialSchedule;
      state.selectedLevel = '';
      state.selectedClass = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleData = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.scheduleData = initialSchedule;
      });
  },
});

export const { setSelectedLevel, setSelectedClass, clearError, resetSchedule } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
