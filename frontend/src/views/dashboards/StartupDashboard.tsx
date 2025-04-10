import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import Congratulations from '../../components/dashboards/analytics/Congratulations'; // Welcome card
import RecentTransactionCard from '../../components/widgets/cards/RecentTransactionCard'; // Placeholder stat card

const StartupDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Startup Dashboard</h1>
      {user ? (
        <p className="mb-4">
          Welcome, {user.user_metadata?.full_name || user.email}!
          ({user.email})
        </p>
      ) : (
        <p className="mb-4">User information not available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Congratulations />
        <RecentTransactionCard />
      </div>

      {/* <p>Placeholder for startup-specific widgets and information.</p> */}
    </div>
  );
};

export default StartupDashboard; 