import React from 'react';
import { Card } from 'flowbite-react';

const PortfolioReportingPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Reporting</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will allow investors to generate and view reports based on their portfolio data.
        </p>
        {/* Placeholder for reporting options/generation UI */}
      </Card>
    </div>
  );
};

export default PortfolioReportingPage; 