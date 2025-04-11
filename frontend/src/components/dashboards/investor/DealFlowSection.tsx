import React, { useState } from 'react';
import { Card, Button, Table, Badge, Avatar, Dropdown, Tooltip, Progress } from 'flowbite-react';
import { 
  IconTrendingUp, IconArrowDown, IconDotsVertical, IconFilter, 
  IconCheck, IconX, IconEdit, IconTrash, IconCurrencyDollar,
  IconDownload, IconSend, IconCalendar, IconChartPie, IconEye,
  IconChevronLeft, IconChevronRight, IconSearch, IconPlus, IconArrowsSort
} from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MockDealFlow } from 'src/api/mocks/data/investorDashboardMockData';

interface DealFlowSectionProps {
  dealFlowData: MockDealFlow;
  isLoading?: boolean;
}

const DealFlowSection: React.FC<DealFlowSectionProps> = ({ dealFlowData, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'evaluating' | 'negotiating' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChart, setShowChart] = useState<'stage' | 'industry'>('stage');
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 4;

  // Filter deals based on active tab and search query
  const filteredDeals = dealFlowData.recentDeals
    .filter(deal => {
      if (activeTab === 'all') return true;
      if (activeTab === 'evaluating') return deal.status === 'Evaluating';
      if (activeTab === 'negotiating') return deal.status === 'Negotiating' || deal.status === 'Term Sheet';
      if (activeTab === 'closed') return deal.status === 'Closed';
      return true;
    })
    .filter(deal => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        deal.startupName.toLowerCase().includes(query) ||
        deal.industry.toLowerCase().includes(query) ||
        deal.stage.toLowerCase().includes(query)
      );
    });

  // Pagination logic
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  // Helper for status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Evaluating': return 'blue';
      case 'Due Diligence': return 'purple';
      case 'Term Sheet': return 'yellow';
      case 'Negotiating': return 'warning';
      case 'Closed': return 'success';
      default: return 'gray';
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Chart options for deal stages
  const stageChartOptions: ApexOptions = {
    labels: dealFlowData.dealsByStage.map(item => item.stage),
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px'
    },
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981', '#6366F1'],
    chart: {
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function(value) {
          return value + ' deals';
        }
      }
    }
  };

  // Chart options for industry breakdown
  const industryChartOptions: ApexOptions = {
    labels: dealFlowData.dealsByIndustry.map(item => item.industry),
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px'
    },
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981', '#6366F1', '#F59E0B', '#6B7280'],
    chart: {
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function(value) {
          return value + '%';
        }
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-28 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-28 bg-gray-200 rounded-md"></div>
            </div>
          </div>
          <div className="h-5 bg-gray-200 rounded-md w-1/3 mt-6"></div>
          <div className="h-32 bg-gray-200 rounded-md"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 -mt-6 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-bold text-white">Deal Flow</h5>
          <Button size="xs" color="light">
            <IconPlus size={14} className="mr-1" /> Add Deal
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Active Deals</p>
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{dealFlowData.activeDeals}</h4>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-full">
            <IconTrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Pipeline Value</p>
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(dealFlowData.pipelineValue)}</h4>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-full">
            <IconCurrencyDollar size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <div className="bg-indigo-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Startups Evaluated</p>
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{dealFlowData.totalStartupsEvaluated}</h4>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-full">
            <IconEye size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Deal breakdown charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Deals by Stage
            </h6>
            <Tooltip content="View deals by stage">
              <Button
                color="light"
                size="xs"
                onClick={() => setShowChart('stage')}
                className={showChart === 'stage' ? 'border-blue-600 text-blue-600' : ''}
              >
                <IconChartPie size={16} />
              </Button>
            </Tooltip>
          </div>
          {showChart === 'stage' && (
            <div className="relative">
              <Chart 
                options={stageChartOptions}
                series={dealFlowData.dealsByStage.map(item => item.count)}
                type="donut"
                height={220}
              />
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Industry Distribution
            </h6>
            <Tooltip content="View distribution by industry">
              <Button
                color="light"
                size="xs"
                onClick={() => setShowChart('industry')}
                className={showChart === 'industry' ? 'border-purple-600 text-purple-600' : ''}
              >
                <IconChartPie size={16} />
              </Button>
            </Tooltip>
          </div>
          {showChart === 'industry' && (
            <div className="relative">
              <Chart 
                options={industryChartOptions}
                series={dealFlowData.dealsByIndustry.map(item => item.percentage)}
                type="donut"
                height={220}
              />
            </div>
          )}
        </div>
      </div>

      {/* Deal table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recent Deals
          </h6>
          
          <div className="flex space-x-2 items-center">
            <div className="flex bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'evaluating' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('evaluating')}
              >
                Evaluating
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'negotiating' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('negotiating')}
              >
                Negotiating
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'closed' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('closed')}
              >
                Closed
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconSearch size={14} className="text-gray-500" />
              </div>
              <input 
                type="text"
                className="block w-full pl-10 pr-3 py-1.5 text-xs border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {currentDeals.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-gray-500 dark:text-gray-400">No deals found matching your criteria.</p>
            <Button size="xs" color="light" className="mt-2" onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
            }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell className="text-xs">Startup</Table.HeadCell>
                  <Table.HeadCell className="text-xs">Amount</Table.HeadCell>
                  <Table.HeadCell className="text-xs">Stage</Table.HeadCell>
                  <Table.HeadCell className="text-xs">Status</Table.HeadCell>
                  <Table.HeadCell className="text-xs">Last Activity</Table.HeadCell>
                  <Table.HeadCell className="text-xs">
                    <span className="sr-only">Actions</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {currentDeals.map((deal) => (
                    <Table.Row key={deal.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            size="xs" 
                            rounded 
                            img={`https://ui-avatars.com/api/?name=${encodeURIComponent(deal.startupName)}&background=random`}
                          />
                          <div>
                            <p className="font-medium text-sm">{deal.startupName}</p>
                            <p className="text-xs text-gray-500">{deal.industry}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-sm">{formatCurrency(deal.amount)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="indigo" size="sm">{deal.stage}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={getStatusColor(deal.status)} size="sm">{deal.status}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-xs text-gray-500">{deal.lastActivity}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Dropdown
                          label=""
                          dismissOnClick={true}
                          renderTrigger={() => (
                            <Button size="xs" color="light">
                              <IconDotsVertical size={14} />
                            </Button>
                          )}
                        >
                          <Dropdown.Item icon={IconEye}>View Details</Dropdown.Item>
                          <Dropdown.Item icon={IconEdit}>Edit Deal</Dropdown.Item>
                          <Dropdown.Item icon={IconCalendar}>Schedule Meeting</Dropdown.Item>
                          <Dropdown.Item icon={IconSend}>Send Email</Dropdown.Item>
                          <Dropdown.Item icon={IconTrash}>Remove Deal</Dropdown.Item>
                        </Dropdown>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  Showing {indexOfFirstDeal + 1}-{Math.min(indexOfLastDeal, filteredDeals.length)} of {filteredDeals.length} deals
                </span>
                <div className="flex space-x-1">
                  <Button
                    size="xs"
                    color="light"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <IconChevronLeft size={14} />
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      size="xs"
                      color={currentPage === index + 1 ? "blue" : "light"}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    size="xs"
                    color="light"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <IconChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default DealFlowSection; 