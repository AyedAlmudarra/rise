import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database';
import { Spinner, Alert, Badge, Card, Avatar, Button, Dropdown, Timeline, Modal, Progress, Tooltip, Tabs } from 'flowbite-react';
import { mockStartupData, generateMockData } from '../../api/mocks/data/startupDashboardMockData';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconBulb,
  IconRefresh,
  IconChartBar,
  IconBuilding,
  IconChartPie,
  IconRobot,
  IconFocus,
  IconUsers,
  IconBell,
  IconDots,
  IconArrowUp,
  IconSettings,
  IconSearch,
  IconCalendar,
  IconClipboard,
  IconStar,
  IconMail,
  IconDownload,
  IconArrowRight,
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconBriefcase,
  IconTrendingUp,
  IconDotsVertical,
  IconScale,
  IconListCheck,
  IconMapPin,
  IconCurrencyDollar,
  IconTargetArrow,
  IconAlertTriangle,
  IconCalendarEvent
} from "@tabler/icons-react";

// Import the refactored section components
import {
  CompanyOverviewCard,
  InvestorInterestSection,
} from "../../components/dashboards/startup";

// Remove Congratulations import for now unless we decide to use it
// import Congratulations from '../../components/dashboards/analytics/Congratulations';

// Remove helper functions (moved to KeyMetricsSection)
// const formatCurrency = ...
// const formatPercentage = ...

// Remove old section component definitions
// const KeyMetricsSection = ...
// const AIInsightsSection = ...
// const FundingReadinessSection = ...
// const InvestorInterestSection = ...

// Helper CardBox component (optional, for consistent card styling)
const CardBox: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 h-full ${className}`}>
        {children}
    </div>
);

// --- Modern Dashboard Card Base Component ---
const DashboardCard: React.FC<{
  children: React.ReactNode; 
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  minHeight?: string;
}> = ({ 
  children, 
  className = '', 
  title, 
  icon, 
  actions,
  loading = false,
  minHeight = 'min-h-[16rem]'
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}>
    {/* Card with subtle gradient border effect */}
    <div className="p-0.5 rounded-xl bg-gradient-to-br from-transparent via-transparent to-transparent hover:from-blue-50 hover:via-purple-50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:via-purple-900/20 dark:hover:to-transparent">
      <div className="bg-white dark:bg-gray-800 rounded-[0.65rem] p-4 sm:p-6">
        {/* Header Section */}
        {(title || actions) && (
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            {title && (
              <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                {title}
              </h5>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        
        {/* Content Section */}
        <div className={`${minHeight} ${loading ? 'opacity-60' : ''}`}>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto"></div>
              </div>
            </div>
          ) : children}
        </div>
      </div>
    </div>
  </div>
);

// --- Main StartupDashboard Component ---

const StartupDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [showMetricsSummary, setShowMetricsSummary] = useState<boolean>(true);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  
  // Generate dynamic mock data based on the fetched startup profile
  const [mockData, setMockData] = useState(mockStartupData);
  
  // ++ Add State for Parsed Analysis Data ++
  // const [parsedAnalysisData, setParsedAnalysisData] = useState<any | null>(null); // <-- Removed

  // Update mock data whenever startupData changes
  useEffect(() => {
    if (startupData) {
      setMockData(generateMockData(startupData));
    }
  }, [startupData]);

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'investor', message: 'Alpha Ventures viewed your profile', time: '10m ago', read: false, icon: <IconBriefcase size={18} className="text-blue-500" /> },
    { id: 2, type: 'insight', message: 'AI Insight: Consider targeting the EdTech sector.', time: '2h ago', read: false, icon: <IconBulb size={18} className="text-yellow-500" /> },
    { id: 3, type: 'funding', message: 'Funding Readiness Score increased to 75 (+5)', time: '1d ago', read: false, icon: <IconTrendingUp size={18} className="text-green-500" /> },
    { id: 4, type: 'system', message: 'Weekly analytics report is ready', time: '2d ago', read: true, icon: <IconChartBar size={18} className="text-gray-500" /> },
  ];

  // Recent activities mock data
  const recentActivities = [
    { id: 1, action: 'Updated financial metrics', timestamp: '2 hours ago', user: 'You' },
    { id: 2, action: 'Investor from Blue Capital viewed your pitch deck', timestamp: '1 day ago', user: 'Sarah Chen' },
    { id: 3, action: 'Added team member profile', timestamp: '3 days ago', user: 'You' },
    { id: 4, action: 'Received new funding match', timestamp: '1 week ago', user: 'System' },
  ];

  // Upcoming tasks mock data
  const upcomingTasks = [
    { id: 1, title: 'Investor meeting with VentureX', date: 'Tomorrow, 2:00 PM', priority: 'high' },
    { id: 2, title: 'Update financial projections', date: 'Next Monday', priority: 'medium' },
    { id: 3, title: 'Complete pitch deck revisions', date: 'In 3 days', priority: 'high' },
  ];

  useEffect(() => {
    fetchStartupData();
    
    // Check if user was recently registered (within last 5 minutes)
    const registrationTime = localStorage.getItem('registration_timestamp');
    if (registrationTime) {
      const timeDiff = Date.now() - parseInt(registrationTime);
      if (timeDiff < 5 * 60 * 1000) { // 5 minutes
        setIsNewUser(true);
        setShowWelcomeModal(true);
        // Clear the registration timestamp
        localStorage.removeItem('registration_timestamp');
      }
    }
  }, [user]);

  // ++ Add useEffect to parse analysis data when startupData changes ++
  // useEffect(() => { // <-- Removed Block Start
  //   if (startupData && startupData.ai_analysis) {
  //     try {
  //       // Check if ai_analysis is already an object (it might be if fetched directly)
  //       if (typeof startupData.ai_analysis === 'object') {
  //         setParsedAnalysisData(startupData.ai_analysis);
  //         console.log("AI Analysis data is already an object:", startupData.ai_analysis); // Debug log
  //       } else if (typeof startupData.ai_analysis === 'string') {
  //         // Attempt to parse if it's a string
  //         const parsed = JSON.parse(startupData.ai_analysis);
  //         setParsedAnalysisData(parsed);
  //         console.log("Successfully parsed AI Analysis JSON string:", parsed); // Debug log
  //       } else {
  //         // Handle unexpected type
  //         console.warn("ai_analysis is neither object nor string:", typeof startupData.ai_analysis);
  //         setParsedAnalysisData({ error: "Unexpected analysis data format." });
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse ai_analysis JSON:", error);
  //       console.error("Raw data received:", startupData.ai_analysis); // Log raw data on error
  //       // Store the error state or specific error message
  //       const errorMessage = error instanceof Error ? error.message : "Unknown parsing error";
  //       setParsedAnalysisData({ error: `Failed to parse analysis data. Details: ${errorMessage}` }); 
  //     }
  //   } else {
  //     // console.log("No startupData or ai_analysis field found, clearing parsed data."); // Debug log - can be verbose
  //     setParsedAnalysisData(null); // Clear if no analysis data
  //   }
  // }, [startupData]); // <-- Removed Block End

  const fetchStartupData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      // Simplified select, no longer need AI fields here
      const { data, error, status } = await supabase
        .from('startups')
        .select('*') 
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setStartupData(data);
        if (isNewUser) {
          toast.success("Welcome to your RISE dashboard!", { icon: "🚀" });
        }
      } else {
        setStartupData(null);
        if (isNewUser) {
          toast.error("There was an issue loading your profile. Please contact support.");
        }
      }
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Error fetching startup data:", error.message);
      setDataError(error.message);
      setStartupData(null);
      toast.error("Error loading dashboard data. Please try refreshing.");
    } finally {
      setDataLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    toast.loading("Refreshing dashboard data...");
    try {
      await fetchStartupData();
      toast.dismiss();
      toast.success("Dashboard data refreshed!", { id: 'refresh-success' });
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to refresh data");
    }
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  // Handling refresh requests from child components
  // const handleRefresh = async () => { // <-- Removed Block Start
  //   // Called by child components to request a new analysis
  //   if (!startupData?.id) {
  //     toast.error("Cannot trigger analysis: Startup ID missing.");
  //     return;
  //   }

  //   setIsRefreshing(true);
  //   toast.loading("Requesting new AI analysis...");

  //   try {
  //     const { error } = await supabase.functions.invoke('request-analysis', {
  //       body: { startup_id: startupData.id },
  //     });

  //     if (error) {
  //       throw error;
  //     }

  //     toast.dismiss();
  //     toast.success("Analysis requested! Check back shortly.");

  //     // Refresh data after a short delay
  //     setTimeout(() => {
  //       refreshData();
  //     }, 1500);

  //   } catch (error: any) {
  //     toast.dismiss();
  //     console.error("Error requesting analysis:", error);
  //     toast.error(`Failed to request analysis: ${error.message || 'Unknown error'}`);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // }; // <-- Removed Block End

  // Enhanced welcome message with quick stats
  const renderWelcomeHeader = () => (
    <div className="mb-6 rounded-xl overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 py-6 px-6">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <path d="M20,20 L780,20 L780,780 L20,780 L20,20 Z" stroke="white" strokeWidth="40" fill="none" strokeLinecap="round" strokeDasharray="80,50" />
            <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="40" fill="none" strokeDasharray="80,50" />
          </svg>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center z-10">
          {/* Avatar and Name Section */}
          <div className="flex items-start md:items-center mb-4 md:mb-0">
            <div className="relative">
         <Avatar
            img={startupData?.logo_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(startupData?.name || user?.email || 'S')}&background=random&color=fff`}
            rounded
            size="lg"
                className="ring-4 ring-white/30 shadow-lg"
              />
              {startupData?.operational_stage && (
                <span className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full ring-2 ring-white/70">
                  <IconChartBar size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl font-bold text-white">
             {startupData?.name || 'Startup Dashboard'}
           </h1>
              <p className="text-sm text-blue-100 flex items-center">
                {user?.user_metadata?.full_name || user?.email}
             {!dataLoading && (
                  <span className="ml-3 flex items-center text-blue-200/70">
                    <IconRefresh 
                      size={14} 
                      className="mr-1 hover:text-white cursor-pointer transition-colors" 
                      onClick={refreshData} 
                    />
                    {lastUpdated.toLocaleTimeString()} 
                  </span>
             )}
           </p>
         </div>
       </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              color="light" 
              className="bg-white/10 hover:bg-white/20 border-0 text-white"
              onClick={refreshData}
            >
              <IconRefresh size={15} className={`mr-1 ${dataLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
         <div className="relative">
                <Button
                 size="sm"
                className="bg-white/10 hover:bg-white/20 border-0 text-white"
                 onClick={() => setShowNotifications(!showNotifications)}
                >
                <IconBell size={15} className="mr-1" />
                <span className="hidden sm:inline">Notifications</span>
                 {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                      {notificationCount}
                    </div>
                 )}
                </Button>
            </div>
            
            <Dropdown 
              label="" 
              dismissOnClick={true} 
              renderTrigger={() => (
                <Button size="sm" className="bg-white/10 hover:bg-white/20 border-0 text-white px-2">
                  <IconDotsVertical size={18} />
                     </Button>
                   )}
            >
              <Dropdown.Item icon={IconSettings}>Settings</Dropdown.Item>
              <Dropdown.Item icon={IconArrowRight}>View Profile</Dropdown.Item>
              <Dropdown.Item icon={IconDownload}>Export Data</Dropdown.Item>
            </Dropdown>
                           </div>
                         </div>
        
        {/* Quick Stats Row */}
        {startupData && !dataLoading && (
          <div className="mt-6 pt-5 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-xs text-blue-100 font-medium">STAGE</p>
                <p className="text-lg text-white font-bold">
                  {startupData.operational_stage || 'N/A'}
                </p>
                       </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-xs text-blue-100 font-medium">TEAM SIZE</p>
                <p className="text-lg text-white font-bold">
                  {startupData.team_size || 'N/A'}
                </p>
                 </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-xs text-blue-100 font-medium">CUSTOMERS</p>
                <p className="text-lg text-white font-bold">
                  {startupData.num_customers || '0'}
                </p>
                 </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-xs text-blue-100 font-medium">REVENUE</p>
                <p className="text-lg text-white font-bold">
                  {startupData.annual_revenue ? `$${startupData.annual_revenue.toLocaleString()}` : '$0'}
                </p>
              </div>
            </div>
          </div>
        )}
         </div>
      
      {/* Optional: Floating info/status cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 -mt-5 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <IconChartBar size={24} className="text-blue-600 dark:text-blue-400" />
       </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Funding Status</p>
              <p className="text-sm font-bold">Seeking Investment</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <IconUsers size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Profile Views</p>
              <p className="text-sm font-bold">18 This Week</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );

  // Status indicators with better visual feedback
  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardBox className="animate-pulse"><div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div></CardBox>
          <CardBox className="animate-pulse"><div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div></CardBox>
          <CardBox className="animate-pulse"><div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div></CardBox>
          <CardBox className="animate-pulse"><div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div></CardBox>
          <CardBox className="animate-pulse md:col-span-2"><div className="h-56 bg-gray-300 dark:bg-gray-700 rounded"></div></CardBox>
        </div>
      );
    }
    if (dataError) {
      return (
        <Alert color="failure">Error loading dashboard: {dataError}</Alert>
      );
    }
    return null;
  };

  // Quick actions section with enhanced styling and tracking
  const renderQuickActions = () => {
    if (dataLoading || dataError) return null;
    
    const quickActions = [
      { id: 'metrics', icon: <IconChartBar size={18} className="text-blue-500" />, label: 'Update Metrics' },
      { id: 'insights', icon: <IconBulb size={18} className="text-amber-500" />, label: 'Get AI Insights' },
      { id: 'investors', icon: <IconUsers size={18} className="text-purple-500" />, label: 'Connect with Investors' },
      { id: 'calendar', icon: <IconCalendar size={18} className="text-green-500" />, label: 'Schedule Meeting' },
      { id: 'pitch', icon: <IconClipboard size={18} className="text-red-500" />, label: 'Edit Pitch Deck' },
    ];
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            Customize <IconSettings size={14} className="ml-1" />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => setActiveQuickAction(action.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg shadow-sm flex items-center transition-all transform hover:scale-105 ${
                activeQuickAction === action.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`mr-3 ${activeQuickAction === action.id ? 'text-white' : ''}`}>
                {action.icon}
              </div>
              <span className="whitespace-nowrap text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render dashboard summary cards with enhanced styling and toggle option
  const renderDashboardSummary = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard Overview</h2>
          <button 
            onClick={() => setShowMetricsSummary(!showMetricsSummary)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {showMetricsSummary ? (
              <>Hide <IconChevronUp size={14} className="ml-1" /></>
            ) : (
              <>Show <IconChevronDown size={14} className="ml-1" /></>
            )}
          </button>
        </div>
        
        {showMetricsSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconChartPie size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      ${mockData.keyMetrics.annualRevenue?.toLocaleString() || 'N/A'}
                    </p>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 15%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconUsers size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.keyMetrics.numCustomers?.toLocaleString() || 'N/A'}
                    </p>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 25%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconRobot size={24} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI Insights</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.aiInsights.length}
                    </p>
                    <Badge color="purple" className="ml-2">NEW</Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconFocus size={24} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Funding Score</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.fundingReadiness.score}/100
                    </p>
                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 5pts
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Render recent activity and upcoming tasks
  const renderActivitySection = () => {
    if (dataLoading || dataError) return null;
    
    return (
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity Timeline */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <IconArrowRight size={14} className="ml-1" />
            </button>
          </div>
          
          <Timeline>
            {recentActivities.map((activity) => (
              <Timeline.Item key={activity.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{activity.timestamp}</Timeline.Time>
                  <Timeline.Title>{activity.action}</Timeline.Title>
                  <Timeline.Body>
                    <span className="text-sm text-gray-500 dark:text-gray-400">By {activity.user}</span>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Tasks</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View calendar <IconCalendar size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-lg border ${
                  task.priority === 'high' 
                    ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10' 
                    : task.priority === 'medium'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.date}</p>
                  </div>
                  <div className="flex items-start">
                    <Badge 
                      color={task.priority === 'high' ? 'failure' : task.priority === 'medium' ? 'warning' : 'info'} 
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                    <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <IconCheck size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center mt-2">
              <IconArrowRight size={14} className="mr-1" /> Add new task
            </button>
          </div>
        </Card>
      </div>
    );
  };

  const renderDashboardContent = () => {
    if (dataLoading && !startupData) {
      return (
         <div className="grid grid-cols-1 gap-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard loading={true} minHeight="min-h-[18rem]"><div /></DashboardCard>
            <DashboardCard loading={true} minHeight="min-h-[18rem]"><div /></DashboardCard>
            <DashboardCard loading={true} minHeight="min-h-[18rem]"><div /></DashboardCard>
          </div>
        </div>
      );
    }

    if (dataError) {
      return (
        <Alert color="failure" className="mb-6">
          <div className="font-medium">Error loading dashboard data</div>
          <div className="mt-1 text-sm">{dataError}</div>
          <Button color="failure" size="xs" onClick={refreshData} className="mt-2">
            Try Again <IconRefresh size={14} className="ml-1"/>
          </Button>
        </Alert>
      );
    }

    if (!startupData) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No startup profile data found.</p>
          {/* Optionally add a button to create profile or contact support */}
        </div>
      );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
          <Tabs aria-label="Dashboard tabs">
             {/* Tab 1: Overview */}
            <Tabs.Item active={activeTab === 'overview'} title="Overview" icon={IconBuilding}>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                 <DashboardCard title="Company Overview" icon={<IconBuilding size={18} />} minHeight="min-h-[18rem]">
                    <CompanyOverviewCard 
                      startupData={startupData} 
                      isLoading={dataLoading} 
                      error={dataError} 
                    />
                 </DashboardCard>
                 <div className="lg:col-span-2">
                    <DashboardCard title="Investor Interest" icon={<IconBriefcase size={18} />} minHeight="min-h-[18rem]">
                        <InvestorInterestSection startupData={startupData} isLoading={dataLoading} />
                    </DashboardCard>
                </div>
              </div>
            </Tabs.Item>

            {/* Tab 3: Metrics & Performance */}  
            <Tabs.Item active={activeTab === 'metrics'} title="Metrics & Performance" icon={IconChartPie}>
              <div className="pt-4 text-center text-gray-500">
                Metrics & Performance data coming soon...
              </div>
            </Tabs.Item>
             {/* Tab 4: Investor Relations */}  
            <Tabs.Item active={activeTab === 'investors'} title="Investor Relations" icon={IconBriefcase}>
              <div className="pt-4 text-center text-gray-500">
                Investor Relations tools coming soon...
              </div>
            </Tabs.Item>
             {/* Tab 5: Activity & Tasks */}  
            <Tabs.Item active={activeTab === 'activity'} title="Activity & Tasks" icon={IconCalendarEvent}>
              {renderActivitySection()} 
            </Tabs.Item>
             {/* Tab 6: Settings */}  
            <Tabs.Item active={activeTab === 'settings'} title="Settings" icon={IconSettings}>
              <div className="pt-4 text-center text-gray-500">
                Settings page coming soon...
              </div>
            </Tabs.Item>

          </Tabs>
        </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeHeader()}

      {/* Notifications Dropdown with AnimatePresence */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed right-6 top-32 md:absolute md:right-0 md:top-auto mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <IconBell size={16} className="mr-2 text-blue-500" />
                Notifications 
                {notificationCount > 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-0.5 px-2 rounded-full">{notificationCount} new</span>}
              </h3>
              {notificationCount > 0 && (
                <Button size="xs" color="light" onClick={markAllNotificationsAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${notification.read ? 'opacity-60' : ''}`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5 mr-3">{notification.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                            <Badge color={
                              notification.type === 'investor' ? 'info' :
                              notification.type === 'insight' ? 'warning' :
                              notification.type === 'funding' ? 'success' : 'gray'
                            } size="xs">{notification.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <IconBell size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">We'll notify you when there's activity</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
              <Button size="xs" color="light" href="#" className="w-full text-xs">
                View all notifications <IconArrowRight size={12} className="ml-1 inline" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */} 
      {renderQuickActions()}

      {/* Dashboard Summary Cards */} 
      {renderDashboardSummary()}

      {/* Main Dashboard Content (Tabs) */}
      {renderDashboardContent()}

    </div>
  );
};

export default StartupDashboard; 