import React from 'react';
import { StartupProfile } from '../../../types/database';
import { Spinner, Alert, Tooltip } from 'flowbite-react';
import { IconTrendingUp, IconCash, IconCashBanknote, IconInfoCircle, IconScale } from '@tabler/icons-react';

// Helper to format currency
const formatCurrency = (value: number | null | undefined, fallback: string = 'N/A'): string => {
    if (value === null || value === undefined) return fallback;
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

interface FinancialPerformanceCardProps {
  startupData: StartupProfile | null;
  isLoading: boolean;
}

const FinancialPerformanceCard: React.FC<FinancialPerformanceCardProps> = ({ startupData, isLoading }) => {

  if (isLoading) {
    return <Spinner aria-label="Loading financial data..." />;
  }

  if (!startupData) {
    return <Alert color="info">No financial data available.</Alert>;
  }

  // --- Placeholder Data (to be replaced or calculated) ---
  const growthRate = 0.15; // Example: 15% growth (replace with actual calculation/AI)
  const summaryInsight = "Maintaining a healthy profit margin despite increased spending."; // Example AI insight

  const formatPercentage = (value: number | null | undefined, fallback: string = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Revenue & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            <IconCash size={16} className="mr-1.5 text-green-500" />
            Annual Revenue
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(startupData.annual_revenue)}
          </p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            <IconCashBanknote size={16} className="mr-1.5 text-red-500" />
            Annual Expenses
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(startupData.annual_expenses)}
          </p>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <IconTrendingUp size={16} className="mr-1.5 text-blue-500" />
            Growth Rate
            <Tooltip content="Year-over-year revenue growth (Placeholder)" className="ml-1">
              <IconInfoCircle size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
            </Tooltip>
          </div>
          <span className={`text-lg font-semibold ${growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatPercentage(growthRate)}
          </span>
        </div>
        {/* Optional: Add a small chart/bar here */}
      </div>

      {/* Quick Summary Insight */}
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
         <div className="flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1.5">
            <IconScale size={16} className="mr-1.5" />
            Financial Snapshot
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {summaryInsight || "AI-powered financial summary will appear here."} 
        </p>
      </div>
    </div>
  );
};

export default FinancialPerformanceCard; 