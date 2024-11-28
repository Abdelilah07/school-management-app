// RouteConfig.jsx
import { Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../features/auth/components/LoginForm';
import SignupPage from '../features/auth/components/SignupForm';
import DemandesPage from '../pages/Documents/DemandesPage';
import {
  HomePage,
  NotFoundPage,
  CoursesPage,
  QuizzesPage,
  FilieresPage,
  Quiz,
  AttendancePage,
  DocumentsPage,
  UserProfilePage,
  SettingsPage,
  UnauthorizedPage,
  SchedulePage,
  TraineesPage,
  CompetencesPage,
  ModulesPage,
  Course,
  GroupesPage,
  Formateur,
  AllQuestions,
  QuizQuestions,
  TeacherQuizzes,
  SecteursPage,
  SchedulerPage,
} from '../pages';

const RouteConfig = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected routes wrapped in DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin', 'trainer', 'trainee']}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Courses routes */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'trainee']}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'trainee']}>
              <Course />
            </ProtectedRoute>
          }
        />

        {/* Quizzes routes */}
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'trainee']}>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'admin']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin', 'trainer', 'trainee']}>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demandes"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <DemandesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'trainee']}>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduler"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <SchedulerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainees"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'admin']}>
              <TraineesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/specializations"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <FilieresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <GroupesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competences"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <CompetencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formateur"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <Formateur />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin', 'trainer', 'trainee']}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modules"
          element={
            <ProtectedRoute allowedRoles={['super user', 'trainer', 'admin']}>
              <ModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['super user']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/questions/:quizId"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <QuizQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/all-questions/:quizId"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <AllQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute allowedRoles={['trainer', 'trainee']}>
              {({ role }) =>
                role === 'trainer' ? <TeacherQuizzes /> : <QuizzesPage />
              }
            </ProtectedRoute>
          }
        />
        <Route
          path="/secteurs"
          element={
            <ProtectedRoute allowedRoles={['super user', 'admin']}>
              <SecteursPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Error routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RouteConfig;
