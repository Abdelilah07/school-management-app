import React from 'react';
import { Navigate, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getUserFromStorage } from '../utils';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = getUserFromStorage('user');
  const userRole = user?.role || null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If `children` is a function, call it with user info
  if (typeof children === 'function') {
    return children(user);
  }

  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
