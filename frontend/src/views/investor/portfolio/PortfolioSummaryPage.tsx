import React from 'react';
import { Card } from 'flowbite-react';

const PortfolioSummaryPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Summary</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will provide an overview of the investor's portfolio, including key aggregate metrics and diversification.
        </p>
        {/* Placeholder for portfolio summary charts/data */}
      </Card>
    </div>
  );
};

export default PortfolioSummaryPage; 