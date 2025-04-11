import React, { useState } from 'react';
import { Card, Button, Badge, Tabs, Tooltip } from 'flowbite-react';
import { 
  IconChartLine, IconBulb, IconArrowUp, IconArrowDown, 
  IconMinus, IconRefresh, IconChartBar, IconWorldUpload, 
  IconArrowAutofitUp, IconInfoCircle, IconExternalLink,
  IconBuildingSkyscraper, IconCurrencyDollar, IconCalendar,
  IconChartPie, IconChevronLeft, IconChevronRight
} from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MockMarketInsights } from 'src/api/mocks/data/investorDashboardMockData';

interface MarketInsightsSectionProps {
  insightsData: MockMarketInsights;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const MarketInsightsSection: React.FC<MarketInsightsSectionProps> = ({ 
  insightsData, 
  isLoading = false,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'insights' | 'exits'>('trends');
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  
  const hasNextInsight = currentInsightIndex < insightsData.insights.length - 1;
  const hasPrevInsight = currentInsightIndex > 0;
  
  const nextInsight = () => {
    if (hasNextInsight) {
      setCurrentInsightIndex(prev => prev + 1);
    }
  };
  
  const prevInsight = () => {
    if (hasPrevInsight) {
      setCurrentInsightIndex(prev => prev - 1);
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };
  
  // Chart options for funding trends
  const fundingTrendsOptions: ApexOptions = {
    chart: {
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#3B82F6', '#8B5CF6', '#F59E0B'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: insightsData.fundingTrends.map(item => item.quarter)
    },
    yaxis: {
      labels: {
        formatter: function(value) {
          return `$${value}K`;
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return `$${value}K average`;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };
  
  // Series data for funding trends
  const fundingTrendsSeries = [
    {
      name: 'Early Stage',
      data: insightsData.fundingTrends.map(item => item.earlyStage)
    },
    {
      name: 'Growth Stage',
      data: insightsData.fundingTrends.map(item => item.growthStage)
    },
    {
      name: 'Late Stage',
      data: insightsData.fundingTrends.map(item => item.lateStage)
    }
  ];
  
  // Get trend icon and color
  const getTrendIcon = (trend: 'Up' | 'Down' | 'Stable') => {
    switch (trend) {
      case 'Up':
        return <IconArrowUp size={14} className="text-green-500" />;
      case 'Down':
        return <IconArrowDown size={14} className="text-red-500" />;
      case 'Stable':
        return <IconMinus size={14} className="text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 -mt-6 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconChartLine size={20} className="text-white mr-2" />
            <h5 className="text-xl font-bold text-white">Market Insights</h5>
          </div>
          <Button size="xs" color="light" onClick={onRefresh}>
            <IconRefresh size={14} className="mr-1" /> Refresh
          </Button>
        </div>
      </div>
      
      {/* Tabs for different sections */}
      <div className="mb-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'trends'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            <div className="flex items-center">
              <IconChartBar size={16} className="mr-1" />
              Funding Trends
            </div>
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'insights'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('insights')}
          >
            <div className="flex items-center">
              <IconBulb size={16} className="mr-1" />
              Industry Insights
            </div>
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'exits'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('exits')}
          >
            <div className="flex items-center">
              <IconArrowAutofitUp size={16} className="mr-1" />
              Recent Exits
            </div>
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div>
        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Top section with trending industries */}
            <div>
              <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Trending Industries
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {insightsData.trendingIndustries.map((industry, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{industry.industry}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(industry.trend)}
                        <span className={`text-sm ${
                          industry.trend === 'Up' 
                            ? 'text-green-600' 
                            : industry.trend === 'Down' 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                        }`}>
                          {industry.changePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {industry.trend === 'Up' 
                        ? 'Growing interest' 
                        : industry.trend === 'Down' 
                          ? 'Declining interest' 
                          : 'Stable interest'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Funding trends chart */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Funding Trends by Stage
                </h6>
                <Tooltip content="Average funding amounts by company stage">
                  <IconInfoCircle size={16} className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="h-72">
                <Chart 
                  options={fundingTrendsOptions}
                  series={fundingTrendsSeries}
                  type="line"
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <IconBulb size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h6 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Expert Market Insights
              </h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Analysis based on market data, industry reports, and AI predictions.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-blue-500 dark:text-blue-400">
                  Insight {currentInsightIndex + 1} of {insightsData.insights.length}
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="xs" 
                    color="light" 
                    disabled={!hasPrevInsight}
                    onClick={prevInsight}
                  >
                    <IconChevronLeft size={14} />
                  </Button>
                  <Button 
                    size="xs" 
                    color="light"
                    disabled={!hasNextInsight}
                    onClick={nextInsight}
                  >
                    <IconChevronRight size={14} />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{insightsData.insights[currentInsightIndex]}"
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <IconCalendar size={14} className="mr-1" />
                Last updated: Today
                <Button 
                  className="ml-4" 
                  size="xs" 
                  color="light"
                  onClick={onRefresh}
                >
                  <IconRefresh size={14} className="mr-1" /> Refresh
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Exits Tab */}
        {activeTab === 'exits' && (
          <div>
            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Recent Exits & Acquisitions
            </h6>
            
            <div className="space-y-4">
              {insightsData.recentExits.map((exit, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-white">
                        {exit.company}
                      </h5>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <IconBuildingSkyscraper size={14} className="mr-1" />
                        Acquired by {exit.acquirer}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formatCurrency(exit.amount)}
                      </div>
                      {exit.multiple && (
                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end">
                          <IconArrowUp size={14} className="mr-1" />
                          {exit.multiple}x multiple
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {exit.date}
                    <Button size="xs" color="light" className="ml-3">
                      <IconExternalLink size={14} className="mr-1" /> Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button size="sm" color="light">
                View More Exits
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MarketInsightsSection; 