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
  IconTrendingUp
} from "@tabler/icons-react";

// Import the refactored section components
import AIInsightsSection from '../../components/dashboards/startup/AIInsightsSection';
import FundingReadinessSection from '../../components/dashboards/startup/FundingReadinessSection';
import {
    CompanyOverviewCard,
    KeyMetricsSection,
    InvestorInterestSection
} from '../../components/dashboards/startup';

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

  const fetchStartupData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      const { data, error, status } = await supabase
        .from('startups')
        // Explicitly select all needed columns, including the new AI ones
        .select(`
          *,
          ai_analysis,
          analysis_status,
          analysis_timestamp 
        `)
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setStartupData(data);
        // If this is the first time fetching data after registration
        // Set isNewUser flag for welcome experience
        if (isNewUser) {
          toast.success("Welcome to your RISE dashboard!", {
            icon: "🚀"
          });
        }
      } else {
        setStartupData(null);
        if (isNewUser) {
          // Handle case where startup profile was created but not found
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
    // Show loading toast
    toast.loading("Refreshing dashboard data...");
    
    try {
      await fetchStartupData();
      toast.dismiss(); // Clear loading toast
      toast.success("Dashboard data refreshed!", { id: 'refresh-success' });
    } catch (error) {
      toast.dismiss(); // Clear loading toast
      toast.error("Failed to refresh data");
    }
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  // Enhanced welcome message with notification center
  const renderWelcomeHeader = () => (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
       <div className="flex items-center mb-3 sm:mb-0">
         <Avatar
            img={startupData?.logo_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(startupData?.name || user?.email || 'S')}&background=random&color=fff`}
            rounded
            size="lg"
            className="mr-4 border-2 border-blue-500 p-0.5"
         />
         <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
             {startupData?.name || 'Startup Dashboard'}
           </h1>
           <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
             Welcome, {user?.user_metadata?.full_name || user?.email}
             {!dataLoading && (
                <Tooltip content={`Last updated: ${lastUpdated.toLocaleString()}`}>
                 <span className="ml-3 hidden sm:inline">·</span>
                 <IconRefresh size={14} className="ml-1 sm:ml-3 text-gray-400 hover:text-blue-600 cursor-pointer" onClick={refreshData} />
                </Tooltip>
             )}
           </p>
         </div>
       </div>
       <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
         <Tooltip content="Refresh Data">
            <Button size="sm" color="light" onClick={refreshData} className="p-1.5">
              <IconRefresh size={18} />
            </Button>
         </Tooltip>
         <div className="relative">
            <Tooltip content="Notifications">
                <Button
                 size="sm"
                 color="light"
                 onClick={() => setShowNotifications(!showNotifications)}
                 className="relative p-1.5"
                >
                 <IconBell size={18} />
                 {notificationCount > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                      {notificationCount}
                    </div>
                 )}
                </Button>
            </Tooltip>
           <AnimatePresence>
             {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700"
                >
                 <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                   <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                   {notificationCount > 0 && (
                     <Button size="xs" color="light" onClick={markAllNotificationsAsRead}>
                       Mark all read
                     </Button>
                   )}
                 </div>
                 <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                   {notifications.length > 0 ? (
                     notifications.map(notification => (
                       <div
                         key={notification.id}
                         className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                       >
                         <div className="flex items-start">
                           <div className="flex-shrink-0 mt-0.5 mr-3">{notification.icon}</div>
                           <div className="flex-1">
                             <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                           </div>
                         </div>
                       </div>
                     ))
                   ) : (
                     <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                   )}
                 </div>
                 <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                   <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                     View all notifications
                   </a>
                 </div>
                </motion.div>
             )}
           </AnimatePresence>
         </div>
          <Tooltip content="Settings">
              <Button size="sm" color="light" onClick={() => navigate('/settings')} className="p-1.5">
                  <IconSettings size={18} />
              </Button>
          </Tooltip>
       </div>
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeHeader()}
      {renderQuickActions()}

      {/* Show Loading/Error indicators OR the dashboard content */}
      {dataLoading || dataError ? (
        renderStatusIndicators()
      ) : (
        <>
          {renderDashboardSummary()}
          {renderActivitySection()}

          {/* Remove Tabs.Group and render components in a grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div className="md:col-span-1">
                  <CompanyOverviewCard startupData={startupData} isLoading={dataLoading} error={dataError} />
              </div>
              <div className="md:col-span-1 h-full">
                  <FundingReadinessSection startupData={startupData} isLoading={dataLoading} onRefreshRequest={refreshData} />
              </div>

              {/* Row 2 */}
              <div className="md:col-span-1">
                  <KeyMetricsSection startupData={startupData} isLoading={dataLoading} />
              </div>
              <div className="md:col-span-1 h-full">
                  <AIInsightsSection startupData={startupData} isLoading={dataLoading} onRefreshRequest={refreshData} />
              </div>

              {/* Row 3 */}
              <div className="md:col-span-2">
                 <InvestorInterestSection startupData={startupData} isLoading={dataLoading} onRefreshRequest={refreshData} />
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StartupDashboard; 