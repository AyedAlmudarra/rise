import React from 'react';
import { Card } from 'flowbite-react';

const ActiveDealsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Active Deals</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will show startups currently in the active due diligence or investment process with the investor.
        </p>
        {/* Placeholder for active deals list/pipeline UI */}
      </Card>
    </div>
  );
};

export default ActiveDealsPage; 