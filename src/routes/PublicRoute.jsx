// This component acts as a wrapper for public routes

import { Navigate } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  // Fetch authentication status from Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Redirect to home page if the user is authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Render the children if the user is not authenticated
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
