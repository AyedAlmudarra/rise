import React from 'react';
import { Card, Tooltip, Dropdown, Button, Alert } from 'flowbite-react';
import { StartupProfile } from '@/types/database';
import { AIAnalysisData, SuggestedKpiItem } from '@/types/database';
import { 
  IconDots, IconInfoCircle,
  IconChartPie, IconDownload, IconMaximize,
} from "@tabler/icons-react";

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
    startupData: StartupProfile | null;
    isLoading: boolean;
}

// Helper mapping from AI-suggested KPI names to StartupProfile keys
// NOTE: This needs to be kept in sync with the AI prompt and the StartupProfile type
const kpiNameToDataKey: { [key: string]: keyof StartupProfile | null } = {
  // Standard KPIs
  "Customer Acquisition Cost": "kpi_cac",
  "Customer Lifetime Value": "kpi_clv",
  "Retention Rate": "kpi_retention_rate",
  "Conversion Rate": "kpi_conversion_rate",
  "Monthly Growth Rate": "kpi_monthly_growth",
  "Payback Period (Months)": "kpi_payback_period",
  "Churn Rate": "kpi_churn_rate",
  "Net Promoter Score": "kpi_nps",
  "Average Order Value": "kpi_avg_order_value",
  "Market Share": "kpi_market_share",
  "Year-over-Year Growth": "kpi_yoy_growth",
  // Financials often used as KPIs
  "Annual Revenue": "annual_revenue",
  "Annual Expenses": "annual_expenses",
  "Monthly Burn Rate": null, // Example: Might need calculation, not direct field
  "Revenue Growth Rate": "kpi_yoy_growth", // Alias or similar
  // Add other mappings as needed based on AI output...
};

// Helper to determine formatting based on key
const getFormatFunction = (key: keyof StartupProfile | null): ((value: number | null | undefined) => string) => {
  if (!key) return formatNumber; // Default
  if (key.includes('revenue') || key.includes('expenses') || key.includes('cac') || key.includes('clv') || key.includes('order_value')) {
    return formatCurrency;
  }
  if (key.includes('rate') || key.includes('share') || key.includes('growth')) {
    return formatPercentage;
  }
  // Add more specific formatting rules if needed (e.g., for payback period months)
  if (key === 'kpi_payback_period') {
      return (val) => val ? `${val} months` : 'N/A';
  }
  return formatNumber; // Default for others like NPS, counts
};

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ analysisData, startupData, isLoading }) => {
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
    const kpiName = kpiItem.kpi || 'Unknown KPI';
    const dataKey = kpiNameToDataKey[kpiName] || null;
    let actualValue: number | string | null = 'N/A'; // Default
    let formatFunc = formatNumber; // Default format

    if (dataKey && startupData && startupData[dataKey] !== undefined) {
      const rawValue = startupData[dataKey];
      // Ensure the value is treated as a number for formatting functions if it's not null
      const numericValue = typeof rawValue === 'number' ? rawValue : null;
      formatFunc = getFormatFunction(dataKey);
      actualValue = formatFunc(numericValue);
    } else if (dataKey === null) {
      // Handle KPIs that need calculation or have no direct field yet
      // You could add logic here to calculate 'Monthly Burn Rate' for example
      actualValue = 'N/A (Calc. Req)';
    }

    // Use the determined actualValue
    const actualValueDisplay = actualValue;

    return (
      <div key={`kpi-${index}`} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 truncate">{kpiItem.kpi || 'Unnamed KPI'}</h6>
          <Tooltip content={kpiItem.justification || 'No justification provided.'} placement="top" style="light">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:whitespace-normal cursor-help">
                  {kpiItem.justification || 'No justification provided.'}
              </p>
          </Tooltip>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">{actualValueDisplay}</p> 
           {/* Optional: Add trend icons later based on historical data */}
        </div>
      );
    }

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
                    {/* TODO: Implement Export Data functionality (e.g., generate CSV from `suggestedKpis` or related actual data) */}
                    <Dropdown.Item icon={IconDownload} onClick={() => alert('TODO: Implement Export Data functionality')}>Export Data (CSV)</Dropdown.Item>
                    {/* TODO: Implement View Full Report functionality (e.g., navigate to a detailed report page/view) */}
                    <Dropdown.Item icon={IconMaximize} onClick={() => alert('TODO: Implement View Full Report functionality')}>View Full Report</Dropdown.Item>
                    {/* TODO: Implement Metric Definitions functionality (e.g., show a modal with definitions based on kpiItem.kpi) */}
                    <Dropdown.Item icon={IconInfoCircle} onClick={() => alert('TODO: Implement Metric Definitions functionality')}>Metric Definitions</Dropdown.Item>
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