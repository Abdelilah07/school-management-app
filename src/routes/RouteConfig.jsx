// RouteConfig.jsx
import { Routes, Route } from 'react-router';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layout/DashboardLayout';
import routes from './routes';

const RouteConfig = () => {
  return (
    <Routes>
      {routes.map(({ path, element: Element, isPublic, allowedRoles }) => {
        if (isPublic) {
          return (
            <Route
              key={path}
              path={path}
              element={
                <PublicRoute>
                  <Element />
                </PublicRoute>
              }
            />
          );
        }

        return (
          <Route key={path} element={<DashboardLayout />}>
            <Route
              path={path}
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  {typeof Element === 'function' ? <Element /> : Element}
                </ProtectedRoute>
              }
            />
          </Route>
        );
      })}
    </Routes>
  );
};

export default RouteConfig;
