// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, roles }) => {
  const { authState } = useAuthContext();

  if (!authState.token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authState.user.role)) {
    // Redirect to home page if user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return element; // Render the protected route component
};

export default PrivateRoute;
