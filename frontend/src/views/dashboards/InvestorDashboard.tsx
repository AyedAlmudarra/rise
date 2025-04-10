import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import Congratulations from '../../components/dashboards/analytics/Congratulations'; // Welcome card
// import RecentTransactionCard from '../../components/widgets/cards/RecentTransactionCard'; // Placeholder stat card - REMOVED
import LatestDeal from '../../components/dashboards/analytics/LatestDeal'; // Placeholder for deal flow/watchlist
import PopularProducts from '../../components/dashboards/analytics/PopularProducts'; // Placeholder for suggested startups

const InvestorDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>
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
        {/* <RecentTransactionCard /> - REMOVED */}
      </div>

      {/* Grid for placeholder components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LatestDeal />
        <PopularProducts />
      </div>

      {/* <p>Placeholder for investor-specific widgets and information.</p> */}
    </div>
  );
};

export default InvestorDashboard; 