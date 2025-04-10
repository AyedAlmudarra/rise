import React, { useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { MockInvestorInterest } from 'src/api/mocks/data/startupDashboardMockData';
import { 
  IconEye, 
  IconScale, 
  IconUsers, 
  IconClock, 
  IconArrowUpRight, 
  IconHeart, 
  IconMessage,
  IconBuildingSkyscraper,
  IconMapPin,
  IconUserCheck,
  IconChevronRight,
  IconSearch,
  IconFilter,
  IconDownload,
  IconStar,
  IconBell,
  IconSend,
  IconSettings
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Tooltip, Badge, Button, Avatar, Progress, Table, Tabs } from 'flowbite-react';

// Mock data for investor interactions
const mockInvestorData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'Horizon Ventures',
    title: 'Principal',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    location: 'San Francisco, CA',
    lastActivity: '2023-09-15T14:30:00Z',
    interest: 'High',
    investmentFocus: ['SaaS', 'FinTech'],
    viewCount: 5,
    hasViewed: {
      profile: true,
      financials: true,
      pitchDeck: true
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'Blue Ocean Capital',
    title: 'Managing Partner',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: 'New York, NY',
    lastActivity: '2023-09-10T09:15:00Z',
    interest: 'Medium',
    investmentFocus: ['Healthcare', 'AI'],
    viewCount: 3,
    hasViewed: {
      profile: true,
      financials: false,
      pitchDeck: true
    }
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    company: 'Catalyst Fund',
    title: 'Associate',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    location: 'Chicago, IL',
    lastActivity: '2023-09-05T16:45:00Z',
    interest: 'Low',
    investmentFocus: ['CleanTech', 'AgTech'],
    viewCount: 2,
    hasViewed: {
      profile: true,
      financials: false,
      pitchDeck: false
    }
  }
];

const InvestorInterestSection: React.FC<{ data: MockInvestorInterest }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'insights'>('overview');
  const [selectedInvestor, setSelectedInvestor] = useState<number | null>(null);
  
  // Enhanced chart options
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 140,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#6366F1'],
    stroke: {
      curve: 'smooth',
      width: 3,
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
    markers: {
      size: 0,
      hover: {
        size: 4,
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return 'Investor Activity:';
          }
        },
        formatter: (val) => val.toString()
      },
      marker: {
        show: false
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
  };

  // Mock trend data - would be provided from the actual data in a real implementation
  const chartSeries = [{
    name: 'Activity',
    data: [10, 14, 12, 20, 18, 25, 28]
  }];

  // Calculate change percentage (mock)
  const changePercent = 23; // This would be calculated from actual data
  
  // Format date for better display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  
  // Get color for interest level badge
  const getInterestColor = (level: string) => {
    switch(level) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'gray';
      default: return 'gray';
    }
  };
  
  // Render the overview tab content
  const renderOverview = () => (
    <>
      {/* Interest trend chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity Trend</h5>
          <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded">
            <IconArrowUpRight size={16} className="mr-1" />
            {changePercent}% this month
          </div>
        </div>
        
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={140}
        />
      </div>

      {/* Stats Grid - primary metrics */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white dark:bg-blue-800 p-2 rounded-lg mr-3">
                <IconEye size={20} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Profile Views</p>
                <div className="flex items-end">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{data.profileViews}</p>
                  <Badge color="success" className="ml-2 mb-0.5" size="xs">+{Math.floor(data.profileViews * 0.12)}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white dark:bg-purple-800 p-2 rounded-lg mr-3">
                <IconScale size={20} className="text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Data Requests</p>
                <div className="flex items-end">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{data.dataRoomRequests}</p>
                  <Badge color="success" className="ml-2 mb-0.5" size="xs">+{Math.floor(data.dataRoomRequests * 0.2)}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional metrics with enhanced cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <IconUserCheck size={18} className="mr-2 text-indigo-500" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Connection Requests</p>
            </div>
            <Tooltip content="Investors who have requested to connect with you">
              <span><IconSearch size={14} className="text-gray-400" /></span>
            </Tooltip>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{data.connectionRequests}</p>
            <Badge color="success" size="sm">+2 new</Badge>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <IconHeart size={18} className="mr-2 text-pink-500" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Favorites</p>
            </div>
            <Tooltip content="Investors who have saved your profile to their favorites">
              <span><IconSearch size={14} className="text-gray-400" /></span>
            </Tooltip>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{data.connectionRequests - 3}</p>
            <Badge color="success" size="sm">+1 new</Badge>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <IconMessage size={18} className="mr-2 text-cyan-500" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Messages</p>
            </div>
            <Tooltip content="Investors who have messaged you">
              <span><IconSearch size={14} className="text-gray-400" /></span>
            </Tooltip>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{Math.floor(data.connectionRequests / 2)}</p>
            <Badge color="warning" size="sm">0 unread</Badge>
          </div>
        </div>
      </div>
      
      {/* Conversion funnel - visual representation of investor journey */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Investor Journey</h5>
          <Button size="xs" color="light">
            <IconFilter size={14} className="mr-1" />
            Filter
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.profileViews}</span>
            </div>
            <Progress
              progress={100}
              size="sm"
              color="blue"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Data Room Requests</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.dataRoomRequests}</span>
            </div>
            <Progress
              progress={Math.round((data.dataRoomRequests / data.profileViews) * 100)}
              size="sm"
              color="indigo"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Connection Requests</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.connectionRequests}</span>
            </div>
            <Progress
              progress={Math.round((data.connectionRequests / data.profileViews) * 100)}
              size="sm"
              color="purple"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meetings Scheduled</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.floor(data.connectionRequests / 3)}</span>
            </div>
            <Progress
              progress={Math.round((Math.floor(data.connectionRequests / 3) / data.profileViews) * 100)}
              size="sm"
              color="success"
            />
          </div>
        </div>
      </div>
    </>
  );
  
  // Render the investors tab content
  const renderInvestors = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Investors</h5>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IconSearch size={14} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Search investors"
            />
          </div>
          <Button size="xs" color="light">
            <IconFilter size={14} className="mr-1" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Investor</Table.HeadCell>
            <Table.HeadCell>Interest</Table.HeadCell>
            <Table.HeadCell>Last Activity</Table.HeadCell>
            <Table.HeadCell>Views</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {mockInvestorData.map(investor => (
              <Table.Row key={investor.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <Avatar img={investor.avatar} size="xs" rounded className="mr-2" />
                    <div>
                      <p className="font-medium">{investor.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{investor.company}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getInterestColor(investor.interest)}>
                    {investor.interest}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{formatDate(investor.lastActivity)}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{investor.viewCount}</span>
                    <div className="flex gap-0.5">
                      <span className={`h-2 w-2 rounded-full ${investor.hasViewed.profile ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} title="Profile"></span>
                      <span className={`h-2 w-2 rounded-full ${investor.hasViewed.financials ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} title="Financials"></span>
                      <span className={`h-2 w-2 rounded-full ${investor.hasViewed.pitchDeck ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`} title="Pitch Deck"></span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <Button size="xs" color="light">
                      <IconSend size={14} className="mr-1" />
                      Message
                    </Button>
                    <Button size="xs" gradientDuoTone="cyanToBlue">
                      View
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button size="xs" color="light">
          See All Investors <IconChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
  
  // Render the insights tab content
  const renderInsights = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Investor Insights</h5>
        <Button size="xs" color="light">
          <IconDownload size={14} className="mr-1" />
          Export
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full mr-3">
              <IconBuildingSkyscraper size={16} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h6 className="text-sm font-medium text-gray-800 dark:text-gray-200">Most Interested Industries</h6>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your startup is attracting investors from <strong>SaaS</strong> and <strong>FinTech</strong> sectors the most.</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full mr-3">
              <IconMapPin size={16} className="text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h6 className="text-sm font-medium text-gray-800 dark:text-gray-200">Geographic Distribution</h6>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Most of your profile views come from <strong>United States (65%)</strong> and <strong>Europe (25%)</strong>.</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 border border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full mr-3">
              <IconUsers size={16} className="text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h6 className="text-sm font-medium text-gray-800 dark:text-gray-200">Investor Demographics</h6>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><strong>75%</strong> of interested investors are from venture capital firms, while <strong>20%</strong> are angel investors.</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full mr-3">
              <IconClock size={16} className="text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <h6 className="text-sm font-medium text-gray-800 dark:text-gray-200">Peak Activity Times</h6>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Investor activity tends to peak on <strong>Tuesdays and Wednesdays</strong>, primarily in the <strong>morning hours</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CardBox className="h-full flex flex-col">
      {/* Enhanced header with tabs */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IconUsers size={20} className="text-indigo-500 mr-2" />
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Investor Interest
            </h5>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button.Group>
              <Button 
                color={activeTab === 'overview' ? 'info' : 'gray'} 
                size="xs" 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Button>
              <Button 
                color={activeTab === 'investors' ? 'info' : 'gray'} 
                size="xs" 
                onClick={() => setActiveTab('investors')}
              >
                Investors
              </Button>
              <Button 
                color={activeTab === 'insights' ? 'info' : 'gray'} 
                size="xs" 
                onClick={() => setActiveTab('insights')}
              >
                Insights
              </Button>
            </Button.Group>
            
            <Button size="xs" color="light" className="p-1.5" pill>
              <IconSettings size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-grow overflow-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'investors' && renderInvestors()}
        {activeTab === 'insights' && renderInsights()}
      </div>

      {/* Last activity timestamp */}
      <div className="mt-auto pt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end border-t border-gray-100 dark:border-gray-700 mt-4">
        <IconClock size={14} className="mr-1" />
        Last Activity: {formatDate(data.lastInterestDate)}
      </div>
    </CardBox>
  );
};

export default InvestorInterestSection; 