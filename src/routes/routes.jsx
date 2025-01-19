import LoginPage from '../features/auth/components/LoginForm';
import SignupPage from '../features/auth/components/SignupForm';
import DemandesPage from '../pages/Documents/DemandesPage';
import Docs from '../pages/Documents/Docs/Docs';
import AddCourse from '../pages/CoursesFormateur/AddCourse';
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
  CoursesFormateur,
  GroupesPage,
  Formateur,
  AllQuestions,
  QuizQuestions,
  TeacherQuizzes,
  SecteursPage,
  SchedulerPage,
} from '../pages';

import { getUserFromStorage } from '../utils';

const ROLES = {
  SUPER_USER: 'super user',
  ADMIN: 'admin',
  TRAINER: 'trainer',
  TRAINEE: 'trainee',
};

const getUserRole = () => getUserFromStorage('user')?.role;


// Components that need role-based rendering
const RoleBasedCourses = () => {
  const role = getUserRole();
  return role === ROLES.TRAINER ? <CoursesFormateur /> : <CoursesPage />;
};

const RoleBasedQuizzes = () => {
  const role = getUserRole();
  return role === ROLES.TRAINER ? <TeacherQuizzes /> : <QuizzesPage />;
};

// Route definitions with their access control
const routes = [
  // Auth routes
  {
    path: '/login',
    element: LoginPage,
    isPublic: true,
  },
  {
    path: '/signup',
    element: SignupPage,
    isPublic: true,
  },

  // Dashboard routes
  {
    path: '/',
    element: HomePage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/home',
    element: HomePage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN, ROLES.TRAINER, ROLES.TRAINEE],
  },

  // Course management
  {
    path: '/courses',
    element: RoleBasedCourses,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/courses/:id',
    element: Course,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/CoursesFormateur/addCourse',
    element: AddCourse,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER],
  },

  // Quiz management
  {
    path: '/quiz/:id',
    element: Quiz,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/quizzes',
    element: RoleBasedQuizzes,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/quizzes/questions/:quizId',
    element: QuizQuestions,
    allowedRoles: [ROLES.TRAINER],
  },
  {
    path: '/quizzes/all-questions/:quizId',
    element: AllQuestions,
    allowedRoles: [ROLES.TRAINER],
  },

  // Administrative routes
  {
    path: '/attendance',
    element: AttendancePage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.ADMIN],
  },
  {
    path: '/docs',
    element: Docs,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/documents',
    element: DocumentsPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/demandes',
    element: DemandesPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/schedule',
    element: SchedulePage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/scheduler',
    element: SchedulerPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },

  // User management
  {
    path: '/trainees',
    element: TraineesPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.ADMIN],
  },
  {
    path: '/specializations',
    element: FilieresPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/groups',
    element: GroupesPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/competences',
    element: CompetencesPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/formateur',
    element: Formateur,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },
  {
    path: '/user-profile',
    element: UserProfilePage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN, ROLES.TRAINER, ROLES.TRAINEE],
  },
  {
    path: '/modules',
    element: ModulesPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.TRAINER, ROLES.ADMIN],
  },
  {
    path: '/settings',
    element: SettingsPage,
    allowedRoles: [ROLES.SUPER_USER],
  },
  {
    path: '/secteurs',
    element: SecteursPage,
    allowedRoles: [ROLES.SUPER_USER, ROLES.ADMIN],
  },

  // Error routes
  {
    path: '/unauthorized',
    element: UnauthorizedPage,
    isPublic: true,
  },
  {
    path: '*',
    element: NotFoundPage,
    isPublic: true,
  },
];

export default routes;
