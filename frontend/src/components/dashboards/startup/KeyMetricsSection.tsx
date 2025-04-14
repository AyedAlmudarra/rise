import React, { useState } from 'react';
import { Card, Badge, Tooltip, Dropdown, Button, Spinner, Alert } from 'flowbite-react';
import { StartupProfile } from '../../../types/database';
import { AIAnalysisData, SuggestedKpiItem } from '../../../types/database';
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
    analysisData: AIAnalysisData | null;
    isLoading: boolean;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ analysisData, isLoading }) => {
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

  // Get suggested KPIs from analysis data
  const suggestedKpis = analysisData?.suggested_kpis || [];
  const hasKpis = Array.isArray(suggestedKpis) && suggestedKpis.length > 0;

  // Render function for individual AI suggested KPI
  const renderSuggestedKpi = (kpiItem: SuggestedKpiItem, index: number) => {
    return (
      <div key={`kpi-${index}`} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 truncate">{kpiItem.kpi || 'Unnamed KPI'}</h6>
          <Tooltip content={kpiItem.justification || 'No justification provided.'} placement="top" style="light">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:whitespace-normal cursor-help">
                  {kpiItem.justification || 'No justification provided.'}
              </p>
          </Tooltip>
          {/* Placeholder for showing actual value if available/relevant */}
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">N/A</p> 
           {/* We might need to fetch the actual value for these suggested KPIs later */}
           {/* Or display trend icons based on some other data source */}
      </div>
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
              <IconChartPie size={20} className="mr-2 text-lime-500" /> AI Suggested KPIs
            </h5>
        <div className="flex items-center">
          {/* <renderTimeRangeSelector /> */} {/* Comment out time range for now */}
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

        {!analysisData && !isLoading && (
            <Alert color="info" icon={IconInfoCircle}>
                 AI analysis data is not available. Request analysis to see suggested KPIs.
            </Alert>
        )}

        {analysisData && !hasKpis && (
             <Alert color="info" icon={IconInfoCircle}>
                 No KPIs were suggested in the latest AI analysis.
            </Alert>
        )}

        {analysisData && hasKpis && (
            // Adjust grid columns based on number of KPIs, maybe max 4?
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(suggestedKpis.length, 4)} gap-4`}>
                {suggestedKpis.map(renderSuggestedKpi)}
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