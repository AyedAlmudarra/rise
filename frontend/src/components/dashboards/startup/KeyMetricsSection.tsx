import React from 'react';
import { CardBox } from 'src/components/shared';
import { MockKeyMetrics } from 'src/api/mocks/data/startupDashboardMockData';
import { IconTrendingUp, IconTrendingDown, IconUser, IconTargetArrow, IconUsers, IconCheck } from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Helper function to format numbers (moved here from dashboard)
const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return 'N/A';
  return `$${value.toLocaleString()}`;
};

const formatPercentage = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return `${value}%`;
}

const KeyMetricsSection: React.FC<{ data: MockKeyMetrics }> = ({ data }) => {
  // Define static colors (adjust as needed for better theme matching)
  const primaryColor = '#3B82F6'; // Blue-500
  const dangerColor = '#EF4444'; // Red-500
  const lightTextColor = '#6B7280'; // Gray-500
  const darkTextColor = '#9CA3AF'; // Gray-400
  const lightBorderColor = '#E5E7EB'; // Gray-200
  const darkBorderColor = '#374151'; // Gray-700

   // Chart Options using static colors
  const revenueExpenseChartOptions: ApexOptions = {
     chart: {
       type: 'area',
       fontFamily: 'inherit',
       // Use a color that works reasonably in both modes for labels
       foreColor: lightTextColor,
       toolbar: { show: false },
       zoom: { enabled: false },
       height: 200,
       sparkline: { enabled: false },
       // Explicitly set background to transparent if needed
       // background: 'transparent', 
     },
     // Use static colors
     colors: [primaryColor, dangerColor],
     dataLabels: { enabled: false },
     stroke: { curve: 'smooth', width: 2 },
     grid: {
         show: true,
         // Conditionally set border color based on a data attribute or CSS class if possible,
         // otherwise, use a neutral color or assume light/dark via parent styling.
         // Using a mid-gray for now.
         borderColor: '#D1D5DB', // Gray-300 - might need CSS to handle dark mode properly
         strokeDashArray: 2,
         xaxis: { lines: { show: false } }, // Hide vertical lines for cleaner look
         yaxis: { lines: { show: true } },
         padding: { top: 5, right: 10, bottom: 0, left: 10 }, // Adjusted padding
     },
     legend: { show: true, position: 'top', horizontalAlign: 'right', offsetY: -15, labels: { colors: lightTextColor } }, // Use light text color for legend
     markers: { size: 0 },
     xaxis: {
       type: 'category',
       categories: data.monthlyRevenue?.map(d => d.month) || [],
       labels: {
         style: {
             colors: lightTextColor, // Use light text color for axis labels
             fontSize: '12px',
         },
       },
       axisBorder: { show: false },
       axisTicks: { show: false },
     },
     yaxis: {
       labels: {
         style: {
           colors: lightTextColor, // Use light text color for axis labels
           fontSize: '12px',
         },
         formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
       },
     },
     tooltip: {
       // Tooltip theme might adapt based on system, or force light/dark
       theme: 'light', // Or 'dark' - static for now
       x: { format: "MMM" },
       y: { formatter: (value) => `$${value.toLocaleString()}`},
     },
     fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
     },
   };

  // Chart Series Data
  const revenueExpenseChartSeries = [
      {
        name: 'Revenue',
        data: data.monthlyRevenue?.map(d => d.value) || [],
      },
      {
        name: 'Expenses',
        data: data.monthlyExpenses?.map(d => d.value) || [],
      },
  ];

  return (
    <CardBox className="md:col-span-2"> {/* Span across two columns on medium screens */}
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        Key Metrics
      </h5>

       {/* Chart Section */}
       <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"> {/* Add border */}
          <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Monthly Revenue vs Expenses</h6>
          <Chart
             options={revenueExpenseChartOptions}
             series={revenueExpenseChartSeries}
             type="area"
             height={200}
             width="100%"
           />
       </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5 text-sm"> {/* Adjust gap */}
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Revenue (Annual)</p> {/* Smaller label */}
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.annualRevenue)}</p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Expenses (Annual)</p>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.annualExpenses)}</p>
         </div>
         <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Revenue Growth</p>
              <p className={`font-semibold text-lg flex items-center ${data.revenueGrowthRate && data.revenueGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`}> {/* Adjusted colors */}
                  {formatPercentage(data.revenueGrowthRate)}
                  {data.revenueGrowthRate && data.revenueGrowthRate > 0 ? <IconTrendingUp size={18} className="ml-1"/> : <IconTrendingDown size={18} className="ml-1"/>}
              </p>
          </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Customers</p>
            <p className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-200">{data.numCustomers ?? 'N/A'} <IconUser size={18} className="ml-1 text-gray-500"/></p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Customer Growth</p>
            <p className={`font-semibold text-lg flex items-center ${data.customerGrowthRate && data.customerGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`}> {/* Adjusted colors */}
                  {formatPercentage(data.customerGrowthRate)}
                   {data.customerGrowthRate && data.customerGrowthRate > 0 ? <IconTrendingUp size={18} className="ml-1"/> : <IconTrendingDown size={18} className="ml-1"/>}
              </p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Employees</p>
            <p className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-200">{data.numEmployees ?? 'N/A'} <IconUsers size={18} className="ml-1 text-gray-500"/></p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">CAC</p>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.kpi_cac)}</p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">CLV</p>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.kpi_clv)}</p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Retention Rate</p>
            <p className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-200">{formatPercentage(data.kpi_retention_rate)} <IconCheck size={18} className="ml-1 text-green-500"/></p>
         </div>
         <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Conversion Rate</p>
            <p className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-200">{formatPercentage(data.kpi_conversion_rate)} <IconTargetArrow size={18} className="ml-1 text-blue-500"/></p>
         </div>
      </div>
    </CardBox>
  );
};

export default KeyMetricsSection; 