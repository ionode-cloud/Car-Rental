import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    const returnTarget = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return (
      <Navigate
        to="/register"
        state={{
          from: returnTarget,
          message: 'Please register or log in to complete your booking.',
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
