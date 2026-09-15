import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../common/Skeleton';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-slate-500">You do not have permission to view this page ({allowedRoles.join(', ')} required).</p>
      </div>
    );
  }

  return <Outlet />;
};
