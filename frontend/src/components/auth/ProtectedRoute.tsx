import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected import path
import Spinner from '../../views/spinner/Spinner'; // Use existing spinner

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while session is being checked
    return <Spinner />;
  }

  if (!session) {
    // User not logged in, redirect to login page
    // Use the path defined in Router.tsx for login (e.g., /auth/auth1/login)
    return <Navigate to="/auth/auth1/login" replace />;
  }

  // User is logged in, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute; 