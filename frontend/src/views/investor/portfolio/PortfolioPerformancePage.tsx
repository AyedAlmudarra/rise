import React from 'react';
import { Card } from 'flowbite-react';

const PortfolioPerformancePage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Performance</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will display performance metrics for the investor's portfolio, such as IRR, MOIC, and individual investment returns.
        </p>
        {/* Placeholder for performance charts/tables */}
      </Card>
    </div>
  );
};

export default PortfolioPerformancePage; 