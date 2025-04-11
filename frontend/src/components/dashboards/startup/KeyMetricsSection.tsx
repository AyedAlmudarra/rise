import React, { useState } from 'react';
import { Card, Badge, Tooltip, Dropdown, Button, Spinner, Alert } from 'flowbite-react';
import { StartupProfile } from '../../../types/database';
import { 
  IconTrendingUp, IconTrendingDown, IconUser, IconTargetArrow, 
  IconUsers, IconCheck, IconEye, IconDots, IconCalendar, 
  IconChevronDown, IconChartBar, IconCurrencyDollar, IconInfoCircle,
  IconChartPie, IconArrowsExchange, IconDownload, IconMaximize,
  IconChartLine
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Helper function to format numbers
const formatCurrency = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'N/A';
  // Simple formatting, can enhance later (e.g., k/M for large numbers)
  return `$${value.toLocaleString()}`;
};

const formatNumber = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'N/A';
  return value.toLocaleString();
};

const formatPercentage = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return 'N/A';
    // Assuming value is stored as a whole number percentage (e.g., 15 for 15%)
    return `${value.toFixed(1)}%`;
}

interface KeyMetricsSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ startupData, isLoading }) => {
  const [timeRange, setTimeRange] = useState<'Last 30 Days' | 'Last Quarter' | 'Last Year' | 'All Time'>('Last Year');
  // Chart state can be added later if needed

  if (isLoading) {
      return (
          <Card className="animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                  ))}
              </div>
          </Card>
      );
  }

  // Although we have startupData, we might still use mockData for chart series
  // until actual time-series data is available from the backend.
  // For now, display direct values from startupData where available.

  const metrics = [
    {
        title: 'Annual Revenue',
        value: formatCurrency(startupData?.annual_revenue),
        icon: <IconCurrencyDollar size={24} className="text-green-500" />,
        tooltip: 'Total revenue generated in the last fiscal year.',
        key: 'annual_revenue'
    },
    {
        title: 'Annual Expenses',
        value: formatCurrency(startupData?.annual_expenses),
        icon: <IconChartLine size={24} className="text-red-500" />,
        tooltip: 'Total expenses incurred in the last fiscal year.',
        key: 'annual_expenses'
    },
    {
        title: 'Customer Acquisition Cost (CAC)',
        value: formatCurrency(startupData?.kpi_cac),
        icon: <IconTargetArrow size={24} className="text-blue-500" />,
        tooltip: 'Average cost to acquire a new customer.',
        key: 'kpi_cac'
    },
    {
        title: 'Customer Lifetime Value (CLV)',
        value: formatCurrency(startupData?.kpi_clv),
        icon: <IconUser size={24} className="text-purple-500" />,
        tooltip: 'Predicted total profit generated from a single customer account.',
        key: 'kpi_clv'
    },
    {
        title: 'Customer Retention Rate',
        value: formatPercentage(startupData?.kpi_retention_rate),
        icon: <IconUsers size={24} className="text-teal-500" />,
        tooltip: 'Percentage of customers retained over a specific period.',
        key: 'kpi_retention_rate'
    },
    {
        title: 'Conversion Rate',
        value: formatPercentage(startupData?.kpi_conversion_rate),
        icon: <IconArrowsExchange size={24} className="text-yellow-500" />,
        tooltip: 'Percentage of users who complete a desired action (e.g., sign up, purchase).' ,
        key: 'kpi_conversion_rate'
    },
     {
        title: 'Total Customers',
        value: formatNumber(startupData?.num_customers),
        icon: <IconUsers size={24} className="text-cyan-500" />,
        tooltip: 'Total number of active customers.',
        key: 'num_customers'
    },
    {
        title: 'Team Size',
        value: formatNumber(startupData?.num_employees),
        icon: <IconUser size={24} className="text-orange-500" />,
        tooltip: 'Total number of full-time employees.',
        key: 'num_employees'
    }
  ];

  const renderMetricCard = (metric: typeof metrics[0]) => {
    const isNA = metric.value === 'N/A';
    return (
      <Tooltip content={metric.tooltip} placement="top" style="light">
          <div key={metric.key} className={`p-4 rounded-lg border ${isNA ? 'border-dashed border-gray-300 dark:border-gray-600 opacity-70' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-1">
                  <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{metric.title}</h6>
                  {!isNA && metric.icon}
              </div>
              <p className={`text-2xl font-semibold ${isNA ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {metric.value}
              </p>
              {/* Placeholder for trend/change indicator */}
               {/* {!isNA && (
                 <p className="text-xs text-green-500 flex items-center mt-1">
                   <IconTrendingUp size={14} className="mr-1"/> +5.2% vs LY
                 </p>
               )} */}
          </div>
      </Tooltip>
    );
  }

  const renderTimeRangeSelector = () => (
    <Dropdown label={timeRange} size="xs" color="light">
      <Dropdown.Item onClick={() => setTimeRange('Last 30 Days')}>Last 30 Days</Dropdown.Item>
      <Dropdown.Item onClick={() => setTimeRange('Last Quarter')}>Last Quarter</Dropdown.Item>
      <Dropdown.Item onClick={() => setTimeRange('Last Year')}>Last Year</Dropdown.Item>
      <Dropdown.Item onClick={() => setTimeRange('All Time')}>All Time</Dropdown.Item>
    </Dropdown>
  );

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white flex items-center">
              <IconChartBar size={20} className="mr-2 text-blue-500" /> Key Metrics
            </h5>
        <div className="flex items-center">
          {renderTimeRangeSelector()}
          <Dropdown 
                    label="" // No label needed, using IconDots
                    size="xs"
                    placement="bottom-end"
            renderTrigger={() => (
                        <Button size="xs" color="light" className="ml-2 p-1">
                           <IconDots className="h-4 w-4" />
                        </Button>
                    )}
                >
                    <Dropdown.Item icon={IconDownload}>Export Data (CSV)</Dropdown.Item>
                    <Dropdown.Item icon={IconMaximize}>View Full Report</Dropdown.Item>
                    <Dropdown.Item icon={IconInfoCircle}>Metric Definitions</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

        {!startupData && !isLoading && (
            <Alert color="info" icon={IconInfoCircle}>
                Key metrics data is not yet available for this startup.
            </Alert>
        )}

        {startupData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(renderMetricCard)}
            </div>
        )}

        {/* Placeholder for future charts */}
        {/* <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h6 className="font-semibold mb-2">Revenue vs Expenses Trend</h6>
            <Chart options={mixedChartOptions} series={mixedChartSeries} type="line" height={300} />
        </div> */} 
    </Card>
  );
};

export { KeyMetricsSection }; 