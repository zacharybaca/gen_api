import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Keep route transition stable until auth state is resolved.
    return <div className="spinner"></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Outlet />;
  }

  // Authenticated but not authorized for admin-only screens.
  return <Navigate to="/" replace />;
};

export default AdminRoute;
