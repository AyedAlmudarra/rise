import React, { useState } from 'react';
import { CardBox } from 'src/components/shared';
import { MockKeyMetrics } from 'src/api/mocks/data/startupDashboardMockData';
import { 
  IconTrendingUp, IconTrendingDown, IconUser, IconTargetArrow, 
  IconUsers, IconCheck, IconEye, IconDots, IconCalendar, 
  IconChevronDown, IconChartBar, IconCurrencyDollar, IconInfoCircle,
  IconChartPie, IconArrowsExchange, IconDownload, IconMaximize,
  IconChartLine
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Tooltip, Popover, Dropdown, Badge, Button } from 'flowbite-react';

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
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'all'>('year');
  const [chartType, setChartType] = useState<'mixed' | 'area' | 'bar'>('mixed');
  const [showProjections, setShowProjections] = useState(true);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  // Modern theme colors
  const colors = {
    primary: '#3B82F6', // Blue-500
    success: '#10B981', // Green-500
    danger: '#EF4444', // Red-500
    warning: '#F59E0B', // Amber-500
    info: '#6366F1', // Indigo-500
    gray: {
      light: '#F3F4F6', // Gray-100
      medium: '#9CA3AF', // Gray-400
      dark: '#4B5563', // Gray-600
    },
  };

  // Enhanced mixed chart options (bar + line)
  const mixedChartOptions: ApexOptions = {
     chart: {
       type: 'line',
       fontFamily: 'Inter, system-ui, sans-serif',
       foreColor: colors.gray.medium,
       toolbar: { 
         show: true,
         tools: {
           download: true,
           selection: false,
           zoom: false,
           zoomin: false,
           zoomout: false,
           pan: false,
           reset: false
         }
       },
       zoom: { enabled: false },
       height: 300,
       stacked: false,
       animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
       },
       dropShadow: {
         enabled: true,
         top: 0,
         left: 0,
         blur: 3,
         opacity: 0.1,
       },
     },
     colors: [colors.info, colors.danger, colors.success],
     dataLabels: { 
        enabled: false 
     },
     stroke: { 
        curve: 'smooth', 
        width: [4, 2, 4],
        dashArray: [0, 0, 8]
     },
     grid: {
         borderColor: 'rgba(0,0,0,0.05)',
         strokeDashArray: 5,
         xaxis: { lines: { show: false } },
         yaxis: { lines: { show: true } },
         padding: { top: 0, right: 0, bottom: 0, left: 10 },
     },
     legend: { 
        show: true, 
        position: 'top', 
        horizontalAlign: 'right', 
        offsetY: -10, 
        fontSize: '12px',
        markers: {
          width: 10,
          height: 10,
          radius: 6,
        },
     },
     markers: { 
        size: 4,
        strokeWidth: 0,
        hover: {
          size: 7,
          sizeOffset: 3
        }
     },
     xaxis: {
       type: 'category',
       categories: data.monthlyRevenue?.map(d => d.month) || [],
       labels: {
         style: {
             fontSize: '12px',
         },
         rotateAlways: false
       },
       axisBorder: { show: false },
       axisTicks: { show: false },
     },
     yaxis: [
       {
         seriesName: 'Revenue',
         labels: {
           style: {
             fontSize: '12px',
           },
           formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
         },
         title: {
           text: "Revenue",
           style: {
             fontSize: '13px',
             fontWeight: 500,
             color: colors.info
           }
         }
       },
       {
         seriesName: 'Expenses',
         opposite: true,
         labels: {
           style: {
             fontSize: '12px',
           },
           formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
         },
         title: {
           text: "Expenses",
           style: {
             fontSize: '13px',
             fontWeight: 500,
             color: colors.danger
           }
         }
       }
     ],
     tooltip: {
       theme: 'light',
       x: { format: "MMM" },
       y: { formatter: (value) => `$${value.toLocaleString()}`},
       shared: true,
       intersect: false,
       marker: { show: true },
     },
     fill: {
        type: ['gradient', 'solid', 'gradient'],
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 100]
        }
     },
     plotOptions: {
       bar: {
         columnWidth: '50%',
         borderRadius: 4
       }
     }
   };

  // Mixed Chart Series Data
  const mixedChartSeries = [
    {
      name: 'Revenue',
      type: 'line',
      data: data.monthlyRevenue?.map(d => d.value) || [],
    },
    {
      name: 'Expenses',
      type: 'column',
      data: data.monthlyExpenses?.map(d => d.value) || [],
    },
    ...(showProjections ? [{
      name: 'Projected Revenue',
      type: 'line',
      data: data.monthlyRevenue?.map((d, i) => {
        // Create a projected revenue line that increases by a small percentage 
        // each month after the current data
        if (i < 7) return d.value;
        return Math.round(d.value * (1 + (i-6) * 0.03));
      }) || [],
    }] : [])
  ];

  // Radial chart for conversion metrics
  const conversionMetricsOptions: ApexOptions = {
    chart: {
      height: 200,
      type: 'radialBar',
      animations: {
        enabled: true,
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      }
    },
    colors: [colors.success, colors.info, colors.warning],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
            color: colors.gray.dark,
            fontFamily: 'Inter, sans-serif',
            offsetY: -10,
          },
          value: {
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            formatter: function (val) {
              return val + '%';
            },
          },
          total: {
            show: true,
            label: 'Avg',
            formatter: function (w) {
              const values = w.globals.seriesTotals;
              const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
              return avg.toFixed(1) + '%';
            }
          }
        },
        track: {
          background: '#f1f5f9',
          strokeWidth: '97%',
          margin: 5,
        },
        hollow: {
          size: '35%',
        }
      }
    },
    labels: ['Retention', 'Conversion', 'Engagement'],
    stroke: {
      lineCap: 'round'
    }
  };

  const conversionMetricsSeries = [
    data.kpi_retention_rate ?? 0,
    data.kpi_conversion_rate ?? 0,
    ((data.kpi_retention_rate ?? 0) + (data.kpi_conversion_rate ?? 0)) / 2 // Mock engagement metric
  ];

  // Function to render trend indicator with appropriate color
  const renderTrendIndicator = (value: number | null | undefined) => {
    if (!value) return null;
    const isPositive = value > 0;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const Icon = isPositive ? IconTrendingUp : IconTrendingDown;
    return <Icon size={18} className={`ml-1 ${color}`} />;
  };

  // Time period selection menu
  const renderTimeRangeSelector = () => (
    <div className="flex items-center">
      <IconCalendar size={16} className="text-gray-500 mr-1.5" />
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value as any)}
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
        <option value="year">This Year</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );

  // Function to render metric card with expandable details
  const renderMetricCard = (
    title: string, 
    value: string | number, 
    icon: JSX.Element,
    trend?: number | null,
    gradient: string = 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    details?: string
  ) => {
    const isExpanded = expandedMetric === title;
    
    return (
      <div 
        className={`col-span-4 bg-gradient-to-br ${gradient} rounded-xl p-4 relative transition-all duration-200 ${isExpanded ? 'shadow-md' : 'hover:shadow-md'} cursor-pointer`}
        onClick={() => setExpandedMetric(isExpanded ? null : title)}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {title}
              {details && (
                <Tooltip content={details}>
                  <span><IconInfoCircle size={12} className="ml-1 text-gray-400" /></span>
                </Tooltip>
              )}
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1 flex items-center">
              {value}
              {trend !== undefined && renderTrendIndicator(trend)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
            {icon}
          </div>
        </div>
        
        {isExpanded && details && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
            <p>{details}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <CardBox className="md:col-span-2 relative overflow-hidden">
      {/* Header with enhanced options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
            <IconChartBar size={20} className="mr-2 text-blue-500" />
            Key Metrics
          </h5>
          <Badge className="ml-2" color="info" size="sm">
            {timeRange}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          {renderTimeRangeSelector()}
          
          <Dropdown 
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <IconDots size={18} />
              </button>
            )}
          >
            <Dropdown.Header>
              <span className="block text-sm">Customize View</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setChartType('mixed')}>
              {chartType === 'mixed' && "✓ "}Mixed Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setChartType('area')}>
              {chartType === 'area' && "✓ "}Area Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setChartType('bar')}>
              {chartType === 'bar' && "✓ "}Bar Chart
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowProjections(!showProjections)}>
              {showProjections ? "✓ " : ""} Show Projections
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <IconDownload size={16} className="mr-2" />
              Export Data
            </Dropdown.Item>
            <Dropdown.Item>
              <IconMaximize size={16} className="mr-2" />
              Full Screen
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {renderMetricCard(
          'Annual Revenue', 
          formatCurrency(data.annualRevenue), 
          <IconCurrencyDollar size={16} className="text-blue-500" />,
          data.revenueGrowthRate,
          'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          'Total revenue generated over the past 12 months from all sources.'
        )}
        
        {renderMetricCard(
          'Customers', 
          data.numCustomers || 'N/A', 
          <IconUser size={16} className="text-green-500" />,
          data.customerGrowthRate,
          'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          'Total number of active paying customers.'
        )}
        
        {renderMetricCard(
          'Growth Rate', 
          formatPercentage(data.revenueGrowthRate), 
          <IconTrendingUp size={16} className="text-purple-500" />,
          data.revenueGrowthRate,
          'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
          'Year-over-year revenue growth percentage.'
        )}
      </div>

      {/* Enhanced Chart Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex justify-between mb-4">
          <div>
            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <IconChartLine size={16} className="mr-1.5 text-blue-500" />
              Revenue vs Expenses
              <Badge color="gray" className="ml-2 px-2 py-0.5 text-xs" size="xs">
                {timeRange === 'month' ? 'Monthly' : timeRange === 'quarter' ? 'Quarterly' : 'Annual'}
              </Badge>
            </h6>
            <p className="text-xs text-gray-500 mt-1">
              {showProjections ? 'Showing projections based on current growth trends' : 'Actual data only'}
            </p>
          </div>
          
          <div className="flex space-x-1">
            <Button.Group>
              <Button 
                onClick={() => setChartType('mixed')}
                color={chartType === 'mixed' ? 'info' : 'gray'}
                size="xs"
              >
                Mixed
              </Button>
              <Button 
                onClick={() => setChartType('area')}
                color={chartType === 'area' ? 'info' : 'gray'}
                size="xs"
              >
                Area
              </Button>
              <Button 
                onClick={() => setChartType('bar')}
                color={chartType === 'bar' ? 'info' : 'gray'}
                size="xs"
              >
                Bar
              </Button>
            </Button.Group>
          </div>
        </div>
        
        <div className="p-1">
          <Chart
            options={mixedChartOptions}
            series={mixedChartSeries}
            type="line" 
            height={300}
            width="100%"
          />
        </div>
        
        <div className="flex justify-end mt-2">
          <div className="inline-flex items-center text-xs text-gray-500 cursor-pointer hover:text-blue-500 transition-colors">
            <IconArrowsExchange size={14} className="mr-1" />
            <span onClick={() => setShowProjections(!showProjections)}>
              {showProjections ? 'Hide Projections' : 'Show Projections'}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout for additional charts and metrics */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Conversion Metrics */}
        <div className="col-span-12 md:col-span-5 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <IconChartPie size={16} className="mr-1.5 text-purple-500" />
            Conversion Metrics
          </h6>
          
          <Chart 
            options={conversionMetricsOptions}
            series={conversionMetricsSeries}
            type="radialBar"
            height={220}
          />
        </div>
        
        {/* Right column - Key Performance Indicators */}
        <div className="col-span-12 md:col-span-7 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <IconTargetArrow size={16} className="mr-1.5 text-amber-500" />
            Key Performance Indicators
          </h6>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs">CAC</p>
                <Tooltip content="Customer Acquisition Cost - the cost to acquire a new customer">
                  <span><IconInfoCircle size={12} className="text-gray-400" /></span>
                </Tooltip>
              </div>
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.kpi_cac)}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs">CLV</p>
                <Tooltip content="Customer Lifetime Value - the total revenue expected from a customer">
                  <span><IconInfoCircle size={12} className="text-gray-400" /></span>
                </Tooltip>
              </div>
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{formatCurrency(data.kpi_clv)}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs">CLV:CAC Ratio</p>
                <Tooltip content="The ratio between Customer Lifetime Value and Customer Acquisition Cost. A higher ratio is better, with 3:1 being ideal.">
                  <span><IconInfoCircle size={12} className="text-gray-400" /></span>
                </Tooltip>
              </div>
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                {data.kpi_clv && data.kpi_cac 
                  ? ((data.kpi_clv / data.kpi_cac)).toFixed(1) + 'x'
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Customer Growth</p>
                <Tooltip content="Month-over-month growth in your customer base">
                  <span><IconInfoCircle size={12} className="text-gray-400" /></span>
                </Tooltip>
              </div>
              <p className={`font-semibold text-lg flex items-center ${data.customerGrowthRate && data.customerGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(data.customerGrowthRate)}
                {renderTrendIndicator(data.customerGrowthRate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardBox>
  );
};

export default KeyMetricsSection; 