// src/features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const THEMES = {
  light: 'cupcake',
  dark: 'night',
};

// Function to get the theme from localStorage or fallback to default
const getSavedTheme = () => {
  if (typeof localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
  }
  return THEMES.light; // Default to light theme
};

const initialTheme = getSavedTheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: initialTheme,
    themes: THEMES,
  },
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === THEMES.light ? THEMES.dark : THEMES.light;
      state.theme = newTheme;
      // Save the theme in localStorage
      localStorage.setItem('theme', newTheme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
