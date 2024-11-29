import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobile: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { toggleMobile } = uiSlice.actions;
export default uiSlice.reducer;
