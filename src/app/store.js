import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  notificationsReducer,
  themeReducer,
  quizzesReducer,
  filieresReducer,
  authReducer,
  coursesReducer,
  coursesformateurReducer,
  competencesSlice,
  scheduleReducer,
  traineesReducer,
  documentsReducer,
  moduleReducer,
  secteursReducer,
  GroupesSlice,
  demandesReducer,
  formateurReducer,
  schedulerReducer,
} from '../features';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  quizzes: quizzesReducer,
  filieres: filieresReducer,
  groups: GroupesSlice,
  competences: competencesSlice,
  auth: authReducer,
  courses: coursesReducer,
  coursesFormateur: coursesformateurReducer,
  schedule: scheduleReducer,
  trainees: traineesReducer,
  documents: documentsReducer,
  modules: moduleReducer,
  secteur: secteursReducer,
  demandes: demandesReducer,
  formateurs: formateurReducer,
  scheduler: schedulerReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
