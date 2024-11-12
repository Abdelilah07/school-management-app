import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { notificationsReducer, themeReducer, sidebarReducer, uiReducer } from '../features';
import QuizzesReducer from '../features/quizzes/quizzesSlice';
import FilieresSlice from '../features/filieres/filieresSlice';
import moduleSlice from '../features/modules/moduleSlice'

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  ui: uiReducer,
  quizzes: QuizzesReducer,
  filieres: FilieresSlice,
  modules:moduleSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
