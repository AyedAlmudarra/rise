import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected import path
import Spinner from '../../views/spinner/Spinner'; // Use existing spinner
import { Alert } from 'flowbite-react'; // For displaying error message

// Define props interface
interface ProtectedRouteProps {
  requiredRole?: 'startup' | 'investor'; // Role is optional, allows for general logged-in routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { session, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading indicator while session is being checked
    return <Spinner />;
  }

  if (!session) {
    // User not logged in, redirect to login page, saving the intended location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role if requiredRole is specified
  if (requiredRole && userRole !== requiredRole) {
    // User is logged in but has the wrong role
    console.warn(`Role mismatch: Required ${requiredRole}, User has ${userRole}. Redirecting.`);
    // Redirect to a default page or an unauthorized page
    // For now, let's redirect to a base path, which should then redirect based on role
    // Or display an inline message
    return (
      <div className="p-4">
        <Alert color="failure">
          Unauthorized: You do not have the required permissions ({requiredRole}) to access this page.
          Your current role is: {userRole || 'Unknown'}.
        </Alert>
        {/* Optionally add a button to go back or to their dashboard */}
      </div>
    );
  }

  // User is logged in and has the correct role (or no specific role required)
  return <Outlet />;
};

export default ProtectedRoute; 