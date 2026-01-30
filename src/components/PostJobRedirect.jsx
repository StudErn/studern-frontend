import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PostJobRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isAuthenticated ? <Navigate to="/dashboard/jobs/create" replace /> : <Navigate to="/login" replace />;
};

export default PostJobRedirect;