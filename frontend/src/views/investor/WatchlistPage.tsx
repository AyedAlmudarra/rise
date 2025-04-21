import React from 'react';
import { Card } from 'flowbite-react';

const WatchlistPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Watchlist</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will display startups that the investor has added to their watchlist for closer monitoring.
        </p>
        {/* Placeholder for watchlist UI */}
      </Card>
    </div>
  );
};

export default WatchlistPage; 