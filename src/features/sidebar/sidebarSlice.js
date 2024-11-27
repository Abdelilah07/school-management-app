import { createSlice } from '@reduxjs/toolkit';
import { menuItems } from './menuConfig';

const initialState = {
  isOpen: false,
  items: menuItems,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSidebar, closeSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
