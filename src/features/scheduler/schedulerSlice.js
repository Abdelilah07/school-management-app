// scheduler.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';
import dayjs from 'dayjs';

// Helper for async thunks
const createApiThunk = (typePrefix, apiCall) => {
  return createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
    try {
      return await apiCall(args);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
};

// Thunks
export const fetchAssignments = createApiThunk('scheduler/fetchAssignments', () =>
  apiService.get('/scheduler')
);

export const addAssignment = createApiThunk('scheduler/addAssignment', (assignment) =>
  apiService.post('/scheduler', assignment)
);

export const updateAssignment = createApiThunk('scheduler/updateAssignment', (assignment) =>
  apiService.put(`/scheduler/${assignment.id}`, assignment)
);

export const deleteAssignment = createApiThunk('scheduler/deleteAssignment', async (id) => {
  await apiService.delete(`/scheduler/${id}`);
  return id;
});

// Helper for handling cases
const handleAsyncCases = (builder, thunk, operation, onSuccess) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentOperation = operation;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      onSuccess(state, action);
      state.currentOperation = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentOperation = null;
    });
};

const initialState = {
  assignments: [],
  startOfWeek: dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'),
  hours: Array.from({ length: 10 }, (_, i) => {
    const startTime = dayjs()
      .hour(8 + i)
      .minute(30);
    return {
      startTime: startTime.format('HH:mm'),
      endTime: startTime.add(1, 'hour').format('HH:mm'),
      subHours: [
        {
          startTime: startTime.format('HH:mm'),
          endTime: startTime.add(30, 'minute').format('HH:mm'),
        },
        {
          startTime: startTime.add(30, 'minute').format('HH:mm'),
          endTime: startTime.add(1, 'hour').format('HH:mm'),
        },
      ],
    };
  }),
  showAddAssignmentModal: false,
  selectedDay: null,
  selectedStartTime: '',
  selectedEndTime: '',
  selectedGroupe: null,
  isAddAssignmentButtonClicked: false,
};

const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    nextWeek: (state) => {
      state.startOfWeek = dayjs(state.startOfWeek).add(1, 'week').format('YYYY-MM-DD');
    },
    prevWeek: (state) => {
      state.startOfWeek = dayjs(state.startOfWeek).subtract(1, 'week').format('YYYY-MM-DD');
    },
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setSelectedStartTime: (state, action) => {
      state.selectedStartTime = action.payload;
    },
    setSelectedEndTime: (state, action) => {
      state.selectedEndTime = action.payload;
    },
    setShowAddAssignmentModal: (state, action) => {
      state.showAddAssignmentModal = action.payload;
      if (!action.payload) {
        state.isEditingMode = false; // Reset editing mode when modal closes
      }
    },
    setSelectedGroupe: (state, action) => {
      if (state.selectedGroupe !== action.payload) {
        state.selectedGroupe = action.payload;
      }
    },
    setSelectedFormateur: (state, action) => {
      if (state.selectedFormateur !== action.payload) {
        state.selectedFormateur = action.payload;
      }
    },
    setAddAssignmentButtonClicked(state, action) {
      state.isAddAssignmentButtonClicked = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchAssignments, 'fetch', (state, action) => {
      state.assignments = action.payload;
    });

    handleAsyncCases(builder, addAssignment, 'add', (state, action) => {
      state.assignments.push(action.payload);
    });

    handleAsyncCases(builder, updateAssignment, 'update', (state, action) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment.id === action.payload.id
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    });

    handleAsyncCases(builder, deleteAssignment, 'delete', (state, action) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload
      );
    });
  },
});

export const {
  nextWeek,
  prevWeek,
  setSelectedDay,
  setSelectedStartTime,
  setSelectedEndTime,
  setShowAddAssignmentModal,
  setSelectedGroupe,
  setSelectedFormateur,
  setAddAssignmentButtonClicked,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
