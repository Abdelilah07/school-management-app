// This component is used to protect routes that require authentication and role-based access
// It checks if the user is authenticated and has the required role to access the route
// If the user is authenticated and has the required role, it renders the protected content

import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Fetch authentication and user role from Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Get the user data from local storage
  const user =
    (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) ||
    null;

  const userRole = user ? user.role : null;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if user's role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected content if authenticated and role is allowed
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
