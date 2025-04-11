import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tooltip, Badge, Button, Avatar, Progress, Table, Tabs, Spinner, Alert } from 'flowbite-react';
import { StartupProfile, InterestedInvestor } from '../../../types/database'; // Adjust path if necessary
import { supabase } from '../../../lib/supabaseClient'; // Added supabase import
import { toast } from 'react-hot-toast'; // Added toast for feedback
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
  IconSettings,
  IconInfoCircle, // Added for loading/info state
  IconExternalLink, // Added for links
  IconRefresh // Added for refresh button
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// --- Mock Data (Keep for MSW) ---
// Removed - now defined in MSW handler
/*
interface MockInvestor {
    id: number;
    name: string;
    company: string;
    title: string;
    avatar: string;
    location: string;
    lastActivity: string; // ISO Date string
    interest: 'High' | 'Medium' | 'Low';
    investmentFocus: string[];
    viewCount: number;
    hasViewed: {
      profile: boolean;
      financials: boolean;
      pitchDeck: boolean;
    };
    profileUrl?: string; // Optional link to investor profile
}

const mockInvestorDataForMSW: MockInvestor[] = [
  {
    id: 1,
    name: 'Sarah Johnson (Mock)',
    company: 'Horizon Ventures (Mock)',
    title: 'Principal',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    location: 'San Francisco, CA',
    lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
    interest: 'High',
    investmentFocus: ['SaaS', 'FinTech'],
    viewCount: 5,
    hasViewed: { profile: true, financials: true, pitchDeck: true },
    profileUrl: '#'
  },
  {
    id: 2,
    name: 'Michael Chen (Mock)',
    company: 'Blue Ocean Capital (Mock)',
    title: 'Managing Partner',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: 'New York, NY',
    lastActivity: new Date(Date.now() - 86400000 * 7).toISOString(),
    interest: 'Medium',
    investmentFocus: ['Healthcare', 'AI'],
    viewCount: 3,
    hasViewed: { profile: true, financials: false, pitchDeck: true },
    profileUrl: '#'
  },
];
*/

// --- Component Props Interface ---
interface InvestorInterestSectionProps {
    startupData: StartupProfile | null;
    // mockData?: any; // Removed mockData prop
    isLoading: boolean; // Add isLoading prop from parent
    onRefreshRequest?: () => void; // Add optional refresh handler
}

// --- Helper Functions ---
const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
  
const getInterestColor = (level: string | null): "success" | "warning" | "gray" => {
    switch(level) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'gray';
      default: return 'gray';
    }
};

// --- Main Component ---
const InvestorInterestSection: React.FC<InvestorInterestSectionProps> = ({ startupData, isLoading, onRefreshRequest }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'investors'>('overview'); 
  const [investors, setInvestors] = useState<InterestedInvestor[]>([]);
  // Removed internal loading/error states, use parent's isLoading
  // const [investorsLoading, setInvestorsLoading] = useState<boolean>(true);
  const [investorsError, setInvestorsError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Fetching Logic --- 
  const fetchInterestedInvestors = useCallback(async (showLoadingIndicator = true) => {
      if (!startupData?.id) {
          // setInvestorsLoading(false); // No longer manage internal loading
          return;
      }

      console.log("[Investor Interest] Fetching for startup ID:", startupData.id);
      if (showLoadingIndicator) {
          setIsRefreshing(true); // Use isRefreshing for manual refresh UI
      }
      setInvestorsError(null);

      try {
          // EXAMPLE QUERY: This needs adjustment based on actual table structure/views/RPC
          const { data, error } = await supabase.rpc('get_interested_investors', {
              startup_param_id: startupData.id
          });

          if (error) {
              throw error;
          }
          
          setInvestors(data || []);
          console.log("[Investor Interest] Fetched data:", data);

      } catch (error: any) {
          console.error("Error fetching interested investors:", error.message);
          setInvestorsError(`Failed to load investor data: ${error.message}`);
          setInvestors([]); 
          toast.error("Could not load investor interest data.");
      } finally {
          // setInvestorsLoading(false); // No longer manage internal loading
          if (showLoadingIndicator) {
              setIsRefreshing(false); // Stop manual refresh indicator
          }
      }
  }, [startupData?.id]);

  // Fetch data when startupData.id becomes available
  useEffect(() => {
      fetchInterestedInvestors(false); // Initial fetch without showing refresh spinner
  }, [fetchInterestedInvestors]);

  // Manual refresh handler
  const handleRefresh = async () => {
    if (onRefreshRequest) {
      setIsRefreshing(true);
      try {
        await onRefreshRequest(); // Call parent dashboard refresh first
        await fetchInterestedInvestors(false); // Then refetch investors without spinner
      } finally {
        setIsRefreshing(false);
      }
    } else {
      // If no parent refresh, just refresh investors locally
      await fetchInterestedInvestors(true);
    }
  };
  // --- End Fetching Logic ---

  // Calculate overview stats based on fetched data
  const totalViews = investors.reduce((sum, inv) => sum + (inv.view_count || 0), 0);
  const engagedInvestors = investors.filter(inv => inv.interest_level !== 'Low' && (inv.has_viewed_financials || inv.has_viewed_deck)).length;
  // Calculate average interest - simple example
  const avgInterestScore = investors.reduce((sum, inv) => {
      if (inv.interest_level === 'High') return sum + 3;
      if (inv.interest_level === 'Medium') return sum + 2;
      if (inv.interest_level === 'Low') return sum + 1;
      return sum;
  }, 0) / (investors.length || 1);
  const avgInterestLevel: InterestedInvestor['interest_level'] = avgInterestScore > 2.5 ? 'High' : avgInterestScore > 1.5 ? 'Medium' : 'Low';

  // Chart options (defined inside component)
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: { enabled: true },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
      toolbar: { show: false }
    },
    colors: ['#4f46e5'], // Indigo-600
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] }
    },
    markers: { size: 0 },
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: { title: { formatter: () => 'Views:' }, formatter: (val) => val.toString() },
      marker: { show: false }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Mock categories for weekly trend
    }
  };

  const chartSeries = [{
    name: 'Views',
    data: [5, 8, 12, 10, 15, 13, 18] // Mock weekly view data - replace with real aggregated data later
  }];

  // --- Render Functions for Tabs ---

  const renderOverviewLoading = () => (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="p-4 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="p-4 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );

  const renderOverview = () => {
      if (isLoading) return renderOverviewLoading(); // Use parent isLoading
      if (investorsError) return <Alert color="failure">Error: {investorsError}</Alert>;

      return (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Views */} 
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center mb-1">
                        <IconEye size={16} className="mr-2 text-blue-500" />
                        <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Profile Views</h6>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalViews}</p>
                    {/* Add trend later if available */}
                     <p className="text-xs text-green-500 flex items-center mt-1">
                         <IconArrowUpRight size={14} className="mr-0.5"/> +15% last 7 days
                     </p>
                </div>
                {/* Engaged Investors */} 
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center mb-1">
                        <IconUsers size={16} className="mr-2 text-green-500" />
                        <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Engaged Investors</h6>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{engagedInvestors}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         Viewed deck/financials
                     </p>
                </div>
                {/* Average Interest */} 
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center mb-1">
                        <IconHeart size={16} className="mr-2 text-red-500" />
                        <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Interest Level</h6>
                    </div>
                    <Badge color={getInterestColor(avgInterestLevel)} size="sm">
                        {avgInterestLevel}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Based on {investors.length} interactions
                    </p>
                </div>
            </div>

            {/* Views Trend Chart - Commented out until real data is available */}
            {/* 
             <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Views (Last 7 Days)</h6>
                 <Chart options={chartOptions} series={chartSeries} type="area" height={100}/>
             </div>
            */}
          </div>
      );
  }
  
  const renderInvestorsTableLoading = () => (
    <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                </div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
            </div>
        ))}
    </div>
  );

  const renderInvestorsTable = () => {
    if (isLoading) return renderInvestorsTableLoading(); // Use parent isLoading
    if (investorsError) return <Alert color="failure">Error: {investorsError}</Alert>;
    if (investors.length === 0) {
      return <div className="text-center py-6 text-gray-500 dark:text-gray-400">No investors have interacted with your profile yet.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <Table hoverable className="text-sm">
          <Table.Head>
            <Table.HeadCell>Investor</Table.HeadCell>
            <Table.HeadCell>Company</Table.HeadCell>
            <Table.HeadCell>Interest</Table.HeadCell>
            <Table.HeadCell>Last Activity</Table.HeadCell>
            <Table.HeadCell><span className="sr-only">Actions</span></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {investors.map((investor) => (
              <Table.Row key={investor.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-3">
                    <Avatar img={investor.avatar_url || undefined} rounded size="sm" />
                    <div>
                      <div className="font-semibold">{investor.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{investor.title || 'N/A'}</div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{investor.company || 'N/A'}</Table.Cell>
                <Table.Cell>
                  <Badge color={getInterestColor(investor.interest_level)} size="xs">
                    {investor.interest_level}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(investor.last_activity_at)}</Table.Cell>
                <Table.Cell>
                  <Button size="xs" color="light" href={investor.profile_url || '#'} target="_blank" rel="noopener noreferrer" disabled={!investor.profile_url}>
                    View Profile <IconExternalLink size={12} className="ml-1" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col"> {/* Added h-full */} 
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex items-center">
            <IconUsers size={18} className="mr-2 text-pink-500" />
            Investor Interest
          </h5>
          <div className="flex items-center gap-2">
              {/* Add Refresh Button */}
              <Tooltip content="Refresh Investor Data">
                  <Button 
                      size="xs" 
                      color="light" 
                      onClick={handleRefresh} 
                      isProcessing={isRefreshing} 
                      disabled={isRefreshing || isLoading} // Disable if parent is loading or self is refreshing
                  >
                      <IconRefresh size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  </Button>
              </Tooltip>
              <Button.Group>
                <Button 
                    size="xs" 
                    color={activeTab === 'overview' ? 'info' : 'light'} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </Button>
                <Button 
                    size="xs" 
                    color={activeTab === 'investors' ? 'info' : 'light'} 
                    onClick={() => setActiveTab('investors')}
                    disabled={isLoading} // Disable changing tab if loading
                >
                    Investors ({isLoading ? '...': investors.length})
                </Button>
              </Button.Group>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
          {activeTab === 'overview' ? renderOverview() : renderInvestorsTable()}
      </div>
    </Card>
  );
};

export default InvestorInterestSection; 