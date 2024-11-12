import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  items: [
    {
      label: 'Home',
      icon: 'Home',
      href: '/school-management-app/home',
    },
    {
      label: 'Courses',
      icon: 'BookOpen',
      href: '/school-management-app/courses',
      count: 24,
      badge: 'New',
    },
    {
      label: 'Quizzes',
      icon: 'BookOpen',
      href: '/school-management-app/quizzes',
      count: 24,
      badge: 'New',
    },
    {
      label: 'Students',
      icon: 'Users',
      href: '/school-management-app/students',
      count: 892,
    },
    {
      label: 'Schedule',
      icon: 'Calendar',
      href: '/school-management-app/schedule',
      count: 12,
    },
    {
      label: 'Reports',
      icon: 'BarChart',
      href: '/school-management-app/reports',
      count: 4,
    },
    {
      label: 'Specialisations',
      icon: 'BookMarked',
      href: '/school-management-app/spicialisations',
      count: 4,
    },
    { type: 'divider' },
    {
      label: 'Documents',
      icon: 'FileText',
      href: '/school-management-app/documents',
    },
    {
      label: 'Settings',
      icon: 'Settings',
      href: '/school-management-app/settings',
    },
  ],
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
